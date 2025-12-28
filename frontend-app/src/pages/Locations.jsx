// src/pages/Locations.jsx

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Navigation,
  MapPin,
  RefreshCw,
  ListFilter,
  Building2,
  TreePine,
  School,
  Store,
  Compass,
  ArrowUpRight,
  Zap,
  X, // Icon X untuk clear search
} from "lucide-react";
import { MOCK_LOCATIONS } from "../config/constants";

// --- UTILITIES & CONFIG ---

const TYPE_ICONS = {
  Campus: School,
  "Public Area": Building2,
  Tourism: TreePine,
  Store: Store,
  Default: MapPin,
};

// Safe Haptic Feedback
const triggerHaptic = () => {
  if (typeof window !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(10);
    } catch (e) {
      // Ignore unsupported devices
    }
  }
};

// Fallback Data (Jika API gagal/kosong)
const LOCAL_MOCK_LOCATIONS = [
  {
    id: 1,
    name: "Universitas AMIKOM",
    address: "Jl. Ring Road Utara, Sleman",
    coords: { lat: -7.7599, lng: 110.4083 },
    status: "Active",
    type: "Campus",
    capacity: 45,
  },
  {
    id: 2,
    name: "UGM Central",
    address: "Bulaksumur, Sleman",
    coords: { lat: -7.7705, lng: 110.3775 },
    status: "Active",
    type: "Campus",
    capacity: 82,
  },
  {
    id: 3,
    name: "UPN Veteran YK",
    address: "Jl. SWK 104, Sleman",
    coords: { lat: -7.7615, lng: 110.409 },
    status: "Active",
    type: "Campus",
    capacity: 65,
  },
  {
    id: 4,
    name: "Malioboro Point",
    address: "Jl. Malioboro, Kota Yogyakarta",
    coords: { lat: -7.7926, lng: 110.3658 },
    status: "Full",
    type: "Public Area",
    capacity: 100,
  },
  {
    id: 5,
    name: "Prambanan Park",
    address: "Jl. Raya Solo, Sleman",
    coords: { lat: -7.752, lng: 110.4914 },
    status: "Active",
    type: "Tourism",
    capacity: 30,
  },
];

const LOCATIONS_DATA =
  MOCK_LOCATIONS?.length > 0 ? MOCK_LOCATIONS : LOCAL_MOCK_LOCATIONS;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius Bumi dalam KM
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// --- COMPONENT: SKELETON LOADER ---
const LocationSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-[1.75rem] p-5 border border-slate-100 dark:border-slate-700/50 mb-4 animate-pulse shadow-sm">
    <div className="flex gap-4 mb-4">
      <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-2xl flex-shrink-0"></div>
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
    </div>
    <div className="h-8 bg-slate-100 dark:bg-slate-700/50 rounded-xl w-full"></div>
  </div>
);

// --- COMPONENT: LOCATION CARD ---
const LocationCard = ({ data, userLoc, isClosest, onClick }) => {
  const IconType = TYPE_ICONS[data.type] || TYPE_ICONS.Default;

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
      case "Full":
        return "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
      default:
        return "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
    }
  };

  const getStatusLabel = (status) => {
    if (status === "Active") return "Tersedia";
    if (status === "Full") return "Penuh";
    return "Maintenance";
  };

  return (
    <div
      onClick={() => {
        triggerHaptic();
        onClick();
      }}
      className={`
        group relative overflow-hidden rounded-[1.75rem] p-5 cursor-pointer transition-all duration-300 transform will-change-transform
        bg-white dark:bg-slate-800 
        ${
          isClosest
            ? "border border-emerald-500/50 shadow-[0_8px_30px_rgb(16,185,129,0.15)] ring-1 ring-emerald-500/20"
            : "border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-lg dark:hover:shadow-black/40 hover:-translate-y-1"
        }
      `}
    >
      {/* Badge Terdekat */}
      {isClosest && (
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10 flex items-center gap-1 shadow-sm">
          <Zap size={10} fill="currentColor" /> Terdekat
        </div>
      )}

      <div className="flex gap-4 mb-4">
        {/* Icon Box */}
        <div
          className={`
          w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors
          ${
            isClosest
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
              : "bg-slate-50 dark:bg-slate-700/50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:group-hover:bg-emerald-900/20"
          }
        `}
        >
          <IconType size={26} strokeWidth={1.5} />
        </div>

        {/* Text Info */}
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="font-bold text-slate-800 dark:text-white text-base truncate mb-1">
            {data.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1 leading-relaxed">
            <MapPin size={12} className="mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{data.address}</span>
          </p>

          <div className="flex gap-2 mt-2">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${getStatusStyle(
                data.status
              )}`}
            >
              {getStatusLabel(data.status)}
            </span>
            {data.distanceDisplay && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Navigation size={10} /> {data.distanceDisplay} km
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center justify-center pl-2 border-l border-slate-100 dark:border-slate-700/50">
          <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 transition-colors flex items-center justify-center text-slate-400 group-hover:scale-110 shadow-sm">
            <ArrowUpRight size={20} />
          </div>
          <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">
            Go
          </span>
        </div>
      </div>

      {/* Capacity Bar */}
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl px-3 py-2.5 flex items-center gap-3 border border-slate-100 dark:border-slate-700/50">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-16">
          Kapasitas
        </span>
        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              data.capacity >= 90
                ? "bg-red-500"
                : data.capacity >= 70
                ? "bg-amber-500"
                : "bg-emerald-500"
            }`}
            style={{ width: `${data.capacity}%` }}
          />
        </div>
        <span
          className={`text-xs font-bold tabular-nums ${
            data.capacity >= 90
              ? "text-red-500"
              : "text-slate-600 dark:text-slate-300"
          }`}
        >
          {data.capacity}%
        </span>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const Locations = () => {
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [userLocation, setUserLocation] = useState(null);
  const [gpsStatus, setGpsStatus] = useState("idle");

  useEffect(() => {
    handleGetLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetLocation = () => {
    triggerHaptic();
    if (!navigator.geolocation) {
      setGpsStatus("error");
      return;
    }
    setGpsStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGpsStatus("success");
      },
      (err) => {
        console.error("GPS Error:", err);
        setGpsStatus(err.code === 1 ? "denied" : "error");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const openMap = (loc) => {
    // FIX: Menggunakan format Universal Link Google Maps yang benar
    // Format: https://www.google.com/maps/dir/?api=1&origin=LAT,LNG&destination=LAT,LNG
    const dest = `${loc.coords.lat},${loc.coords.lng}`;
    let url = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;

    if (userLocation) {
      const origin = `${userLocation.lat},${userLocation.lng}`;
      url += `&origin=${origin}&travelmode=driving`;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const sortedLocations = useMemo(() => {
    let data = LOCATIONS_DATA.map((loc) => {
      const dist = userLocation
        ? calculateDistance(
            userLocation.lat,
            userLocation.lng,
            loc.coords.lat,
            loc.coords.lng
          )
        : null;
      return {
        ...loc,
        distanceRaw: dist,
        distanceDisplay: dist !== null ? dist.toFixed(1) : null,
      };
    });

    // 1. Filter Query
    if (query) {
      const lower = query.toLowerCase();
      data = data.filter(
        (l) =>
          l.name.toLowerCase().includes(lower) ||
          l.address.toLowerCase().includes(lower)
      );
    }

    // 2. Filter Status
    if (filterStatus !== "All") {
      data = data.filter((l) => l.status === filterStatus);
    }

    // 3. Smart Sort
    data.sort((a, b) => {
      // Prioritaskan 'Active' jika filter All
      if (filterStatus === "All") {
        const scoreA = a.status === "Active" ? 1 : 0;
        const scoreB = b.status === "Active" ? 1 : 0;
        if (scoreA !== scoreB) return scoreB - scoreA;
      }

      // Sort berdasarkan jarak jika lokasi user ada
      if (a.distanceRaw !== null && b.distanceRaw !== null)
        return a.distanceRaw - b.distanceRaw;

      // Jika salah satu tidak punya jarak (misal baru load), taruh di bawah
      if (a.distanceRaw !== null) return -1;
      if (b.distanceRaw !== null) return 1;

      // Fallback: Sort Abjad
      return a.name.localeCompare(b.name);
    });

    return data;
  }, [query, filterStatus, userLocation]);

  return (
    // pb-20 untuk memberi ruang di atas bottom nav
    <div className="min-h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans pt-safe-t pb-20">
      {/* --- HEADER --- */}
      {/* pt-safe-t ditambahkan di parent, sticky header perlu handling */}
      <div className="sticky top-0 z-30 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-4 shadow-sm animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                Lokasi RVM
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    gpsStatus === "success"
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-slate-400"
                  }`}
                ></span>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {gpsStatus === "success"
                    ? "Lokasi Akurat"
                    : "Mencari Lokasi..."}
                </p>
              </div>
            </div>
            <button
              onClick={handleGetLocation}
              aria-label="Refresh Lokasi"
              className={`p-2.5 rounded-full border shadow-sm transition-all active:scale-95 ${
                gpsStatus === "loading"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600 animate-spin"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              {gpsStatus === "loading" ? (
                <RefreshCw size={18} />
              ) : (
                <Compass size={18} />
              )}
            </button>
          </div>

          {/* Search Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search
                className="text-slate-400 group-focus-within:text-emerald-500 transition-colors"
                size={18}
              />
            </div>
            <input
              type="text"
              placeholder="Cari area atau nama kampus..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800/50 border-none dark:text-white rounded-xl py-3 pl-10 pr-10 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 shadow-inner"
            />
            {/* Tombol Clear Search (Muncul jika ada text) */}
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  triggerHaptic();
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="px-6 mt-6 max-w-md mx-auto">
        {/* GPS Error Alert */}
        {(gpsStatus === "denied" || gpsStatus === "error") && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 animate-fade-in-up">
            <div className="p-2 bg-white dark:bg-slate-800 rounded-full text-red-500 shadow-sm shrink-0">
              <Compass size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-red-700 dark:text-red-400">
                Lokasi Tidak Aktif
              </h4>
              <p className="text-xs text-red-600/80 dark:text-red-400/70 truncate">
                Aktifkan GPS untuk hasil terdekat.
              </p>
            </div>
            <button
              onClick={handleGetLocation}
              className="text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
            >
              Aktifkan
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1 animate-fade-in-up delay-100">
          <div className="flex items-center gap-1 pr-3 border-r border-slate-200 dark:border-slate-700 mr-1 text-slate-400 shrink-0">
            <ListFilter size={16} />
          </div>
          {["All", "Active", "Full"].map((status) => (
            <button
              key={status}
              onClick={() => {
                triggerHaptic();
                setFilterStatus(status);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap active:scale-95 ${
                filterStatus === status
                  ? "bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-slate-800 dark:border-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              {status === "All"
                ? "Semua"
                : status === "Active"
                ? "Tersedia"
                : "Penuh"}
            </button>
          ))}
        </div>

        {/* Location List */}
        <div className="space-y-4">
          {/* Loading State */}
          {gpsStatus === "loading" && !userLocation ? (
            <div className="animate-fade-in">
              <LocationSkeleton />
              <LocationSkeleton />
              <LocationSkeleton />
            </div>
          ) : sortedLocations.length > 0 ? (
            sortedLocations.map((loc, idx) => (
              <div
                key={loc.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <LocationCard
                  data={loc}
                  userLoc={userLocation}
                  isClosest={
                    idx === 0 &&
                    loc.distanceRaw !== null &&
                    filterStatus === "All" &&
                    loc.status === "Active"
                  }
                  onClick={() => openMap(loc)}
                />
              </div>
            ))
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-[2rem] animate-fade-in-up">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                <Search size={32} />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                Tidak ada lokasi ditemukan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
                Coba cari dengan kata kunci lain atau ubah filter status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Locations;
