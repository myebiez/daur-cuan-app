#include <iostream>
#include <string>
#include <thread>
#include <mutex>
#include <atomic>
#include <chrono>
#include <vector>
#include <fstream>
#include <numeric>
#include <deque>
#include <ctime>
#include <iomanip>
#include <functional>

// --- LIBS EXTERNAL ---
#include <qrencode.h>
#include <curl/curl.h>

// --- FTXUI HEADERS ---
#include <ftxui/dom/elements.hpp>
#include <ftxui/screen/screen.hpp>
#include <ftxui/screen/string.hpp>
#include <ftxui/component/component.hpp>
#include <ftxui/component/screen_interactive.hpp>
#include <ftxui/component/event.hpp>

using namespace std;
using namespace ftxui;

// ==========================================
// 1. KONFIGURASI SISTEM
// ==========================================
const string SERVER_URL = "https://daurcuan.web.id"; 
const string MACHINE_ID = "RVM-LOBBY-01"; 

const string CACHE_FILE = "offline_data.txt";
const int MAX_BIN_CAPACITY = 100;

// ==========================================
// 2. STATE MANAGEMENT
// ==========================================
atomic<bool> isOnline(false);
atomic<bool> isSessionActive(false);
atomic<int> sessionPoints(0);
atomic<int> totalStoredBottles(0);
atomic<bool> isProgramRunning(true);

// Mutex untuk keamanan Thread
mutex logMutex;
mutex graphMutex; 

// ==========================================
// 3. LOGGING SYSTEM
// ==========================================
deque<string> systemLogs;

void addLog(string msg) {
    lock_guard<mutex> lock(logMutex);
    auto now = chrono::system_clock::to_time_t(chrono::system_clock::now());
    stringstream ss;
    ss << put_time(localtime(&now), "%H:%M:%S");
    systemLogs.push_front("[" + ss.str() + "] " + msg);
    if (systemLogs.size() > 15) systemLogs.pop_back();
}

// ==========================================
// 4. NETWORK HELPER
// ==========================================
static size_t WriteCallback(void *contents, size_t size, size_t nmemb, void *userp) {
    ((string*)userp)->append((char*)contents, size * nmemb);
    return size * nmemb;
}

struct Response { bool success; long httpCode; string body; };

Response request(string method, string endpoint, string data = "") {
    CURL *curl; CURLcode res; string readBuffer; long httpCode = 0;
    
    curl = curl_easy_init();
    if(curl) {
        string fullUrl = SERVER_URL + endpoint;
        curl_easy_setopt(curl, CURLOPT_URL, fullUrl.c_str());
        curl_easy_setopt(curl, CURLOPT_TIMEOUT, 3L); 
        curl_easy_setopt(curl, CURLOPT_NOSIGNAL, 1L); 
        
        // Bypass SSL (Penting untuk dev/self-signed certs)
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYHOST, 0L);

        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        headers = curl_slist_append(headers, "ngrok-skip-browser-warning: true");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        if (method == "POST") {
            curl_easy_setopt(curl, CURLOPT_POST, 1L);
            if (!data.empty()) curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data.c_str());
        }

        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);

        res = curl_easy_perform(curl);
        curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &httpCode);
        
        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);

        if (res == CURLE_OK && httpCode >= 200 && httpCode < 300) {
            return {true, httpCode, readBuffer};
        }
    }
    return {false, httpCode, readBuffer};
}

// ==========================================
// 5. SYNC LOGIC
// ==========================================
void saveToCache(int points) {
    ofstream file(CACHE_FILE, ios::app);
    if (file.is_open()) {
        file << points << endl;
        file.close();
        addLog("OFFLINE: Data disimpan ke lokal.");
    }
}

void syncOfflineData() {
    ifstream file(CACHE_FILE);
    if (!file.good()) return; 
    
    vector<int> pending; int val;
    while (file >> val) pending.push_back(val);
    file.close();
    
    if (pending.empty()) return;

    int total = accumulate(pending.begin(), pending.end(), 0);
    addLog("SYNC: Uploading " + to_string(total) + " pts...");
    
    Response res = request("POST", "/api/rvm/input", "{\"points\":" + to_string(total) + "}");
    if (res.success) {
        remove(CACHE_FILE.c_str()); 
        addLog("SYNC: Sukses! Cache bersih.");
    } else {
        addLog("SYNC: Gagal upload. Coba lagi nanti.");
    }
}

// ==========================================
// 6. BACKGROUND WORKERS
// ==========================================
std::function<void()> trigger_render; 
vector<int> graph_data(60, 0); 

void monitorConnection() {
    while (isProgramRunning) {
        Response res = request("GET", "/api/status");
        bool currentOnline = res.success;
        bool active = false;

        if (currentOnline) {
            // 1. Cek Status
            active = (res.body.find("\"status\":\"ACTIVE\"") != string::npos);
            
            // 2. SYNC POIN DARI SERVER (FIX UTAMA)
            if (active) {
                size_t pos = res.body.find("\"sessionPoints\":");
                if (pos != string::npos) {
                    try {
                        size_t start = pos + 16; 
                        size_t end = res.body.find_first_of(",}", start);
                        string valStr = res.body.substr(start, end - start);
                        int serverPoints = stoi(valStr);
                        
                        // Update poin lokal jika beda
                        if (sessionPoints != serverPoints) {
                            sessionPoints = serverPoints;
                            if (trigger_render) trigger_render();
                        }
                    } catch (...) {}
                }
            }

            // 3. Sync Offline Data
            if (!isOnline) { 
                addLog("NETWORK: Koneksi Pulih!");
                this_thread::sleep_for(chrono::seconds(1));
                syncOfflineData();
            }
        } else {
             active = isSessionActive; 
        }
        
        // Update UI States
        if (isOnline != currentOnline) {
            isOnline = currentOnline;
            if (trigger_render) trigger_render();
        }

        if (isSessionActive != active) {
             isSessionActive = active;
             if (!active) {
                 sessionPoints = 0;
                 addLog("SYSTEM: Sesi diakhiri oleh Server.");
             } else {
                 addLog("SYSTEM: Sesi dimulai oleh User.");
             }
             if (trigger_render) trigger_render();
        }

        this_thread::sleep_for(chrono::seconds(1));
    }
}

void sendBottleAsync() {
    addLog("SENSOR: Mendeteksi botol masuk...");
    if (trigger_render) trigger_render();

    Response res = request("POST", "/api/rvm/input", "{\"points\":50}");
    
    // Tambah poin lokal dulu agar UI responsif (nanti akan ditimpa oleh monitorConnection)
    sessionPoints += 50;
    totalStoredBottles++;

    if (res.success) {
        addLog("SERVER: Poin Masuk (+50)");
    } else {
        saveToCache(50);
        addLog("OFFLINE: Poin Disimpan Lokal (+50)");
    }

    // Update Graph (Thread Safe)
    {
        lock_guard<mutex> lock(graphMutex);
        graph_data.push_back(sessionPoints);
        if(graph_data.size() > 60) graph_data.erase(graph_data.begin());
    }

    if (trigger_render) trigger_render();
}

void endSessionAsync() {
    addLog("USER: Menekan tombol selesai...");
    request("POST", "/api/session/end");
    
    sessionPoints = 0;
    isSessionActive = false;
    
    {
        lock_guard<mutex> lock(graphMutex);
        fill(graph_data.begin(), graph_data.end(), 0);
    }

    if (trigger_render) trigger_render();
}

// ==========================================
// 7. UI HELPER
// ==========================================
Element RenderQR(const string& qrContent) {
    QRcode *qr = QRcode_encodeString(qrContent.c_str(), 0, QR_ECLEVEL_M, QR_MODE_8, 1);
    if (!qr) return text("QR Error");

    Elements rows;
    string emptyRow((qr->width * 2) + 8, ' '); 
    auto whiteBlock = text(emptyRow) | bgcolor(Color::White);
    rows.push_back(whiteBlock);

    for (int y = 0; y < qr->width; y += 2) {
        Elements line_elements;
        line_elements.push_back(text("    ") | bgcolor(Color::White));

        for (int x = 0; x < qr->width; x++) {
            bool top = (qr->data[y * qr->width + x] & 1);
            bool bot = false;
            if (y + 1 < qr->width) bot = (qr->data[(y + 1) * qr->width + x] & 1);

            if (top && bot) line_elements.push_back(text(" ") | bgcolor(Color::Black));
            else if (!top && !bot) line_elements.push_back(text(" ") | bgcolor(Color::White));
            else if (top && !bot) line_elements.push_back(text("▀") | color(Color::Black) | bgcolor(Color::White));
            else line_elements.push_back(text("▄") | color(Color::Black) | bgcolor(Color::White));
        }

        line_elements.push_back(text("    ") | bgcolor(Color::White));
        rows.push_back(hbox(move(line_elements)));
    }

    rows.push_back(whiteBlock);
    QRcode_free(qr);
    return vbox(move(rows));
}

// ==========================================
// 8. MAIN FUNCTION
// ==========================================
int main() {
    curl_global_init(CURL_GLOBAL_ALL);
    
    thread monitor(monitorConnection);
    monitor.detach();

    auto screen = ScreenInteractive::Fullscreen();
    trigger_render = [&screen] { screen.Post(Event::Custom); }; 

    auto component = Renderer([&] {
        auto led_color = isOnline ? Color::Green : Color::Red;
        auto led_text = isOnline ? " ONLINE " : " OFFLINE ";
        
        auto header = hbox({
            text(" ♻️  DAUR CUAN RVM ") | bold | color(Color::Cyan),
            text(" v2.2 ") | color(Color::GrayDark),
            filler(),
            text(led_text) | bold | bgcolor(led_color) | color(Color::White) | borderRounded
        });

        float capacity_percent = (float)totalStoredBottles / MAX_BIN_CAPACITY;
        auto gauge_panel = vbox({
            text("BIN CAPACITY") | bold | center,
            gauge(capacity_percent) | color(Color::BlueLight),
            text(to_string(totalStoredBottles) + " / 100") | center
        }) | border | flex;

        // --- GRAPH SAFE RENDER (FIX MEMORY LEAK) ---
        vector<int> current_graph;
        {
            lock_guard<mutex> lock(graphMutex);
            current_graph = graph_data; // Copy by value
        }
        
        auto graph_panel = vbox({
            text("SESSION ACTIVITY") | bold | center,
            // PENTING: Capture 'current_graph' by Value [current_graph]
            graph([current_graph](int width, int height) { return current_graph; }) | color(Color::Magenta) | flex
        }) | border | flex;

        auto left_column = vbox({ gauge_panel, graph_panel }) | flex;

        Element right_display;
        if (!isSessionActive) {
            right_display = vbox({
                filler(),
                text("SCAN UNTUK MEMULAI") | bold | center | blink,
                separator(),
                RenderQR(MACHINE_ID) | center, 
                separator(),
                text("ID: " + MACHINE_ID) | center | color(Color::Yellow),
                filler()
            });
        } else {
            right_display = vbox({
                filler(),
                text("SESI AKTIF") | bold | color(Color::Green) | center,
                text("Silakan Masukkan Botol") | center,
                separator(),
                text(to_string(sessionPoints)) | bold | color(Color::Gold1) | center | size(HEIGHT, EQUAL, 3),
                text("POIN") | center,
                separator(),
                vbox({
                    text(" [1] SIMULASI MASUKKAN BOTOL "),
                    text(" [9] SELESAI / AKHIRI SESI ")
                }) | color(Color::GrayLight) | center,
                filler()
            });
        }
        auto right_column = right_display | border | flex;

        Elements log_elements;
        {
            lock_guard<mutex> lock(logMutex);
            for(const auto& l : systemLogs) log_elements.push_back(text(l));
        }
        auto footer = window(text("SYSTEM LOGS"), vbox(move(log_elements)));

        return vbox({
            header,
            separator(),
            hbox({ left_column, right_column }) | flex,
            footer | size(HEIGHT, EQUAL, 10)
        }) | border;
    });

    component = CatchEvent(component, [&](Event event) {
        if (event == Event::Character('1')) {
            if (isSessionActive) { 
               thread(sendBottleAsync).detach();
            } else {
                addLog("ERROR: Scan QR dulu untuk mulai!");
            }
            return true;
        }
        if (event == Event::Character('9')) {
             if (isSessionActive) thread(endSessionAsync).detach();
             return true;
        }
        if (event == Event::Escape) {
            isProgramRunning = false; 
            screen.Exit(); 
            return true;
        }
        return false;
    });

    screen.Loop(component);
    
    isProgramRunning = false;
    curl_global_cleanup();
    return 0;
}