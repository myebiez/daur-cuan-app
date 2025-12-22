#include <iostream>
#include <string>
#include <thread>
#include <chrono>
#include <cstdlib>
#include <fstream>

// Helper baca status
std::string readStatusFile() {
    std::ifstream file("status.tmp");
    std::string status;
    if (file) std::getline(file, status);
    return status;
}

int main() {
    std::cout << "=== RVM MACHINE SYSTEM V2.0 (LINUX) ===\n";
    std::cout << "[INIT] Menghubungkan ke Cloud Server...\n";

    bool isProcessing = false;

    while (true) {
        // 1. Cek Status Server (Simpan ke status.tmp)
        system("curl -s http://localhost:3001/api/machine/check > status.tmp");
        std::string serverStatus = readStatusFile();

        if (serverStatus == "ACTIVE") {
            if (!isProcessing) {
                std::cout << "\n\n[!!!] USER TERDETEKSI! PINTU TERBUKA.\n";
                std::cout << "Silakan masukkan botol (Ketik '1' lalu Enter).\n";
                std::cout << "Ketik '9' untuk Selesai.\n";
                isProcessing = true;
            }

            std::string input;
            std::cout << "> Input Sensor: ";
            std::cin >> input;

            if (input == "1") {
                std::cout << "[HW] Grrrr... Botol dihancurkan...\n";
                // Kirim Poin (Linux version)
                system("curl -s -X POST -H \"Content-Type: application/json\" -d '{\"points\":50}' http://localhost:3001/api/rvm/input > /dev/null");
                std::cout << "[CLOUD] Poin +50 Terkirim!\n";
            } 
            else if (input == "9") {
                system("curl -s -X POST http://localhost:3001/api/session/end > /dev/null");
                std::cout << "[SYS] Sesi Selesai.\n";
                isProcessing = false;
            }
        } else {
            if (isProcessing) {
                isProcessing = false;
                std::cout << "\n[LOCKED] Menunggu Scan QR...\n";
            }
            std::cout << "." << std::flush;
            std::this_thread::sleep_for(std::chrono::milliseconds(1000));
        }
    }
    return 0;
}