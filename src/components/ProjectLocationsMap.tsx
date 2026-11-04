import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Maximize2,
  Compass,
  Droplets,
  HeartPulse,
  Flame,
  TreePine,
  GraduationCap,
  Building,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Globe,
  Layers,
  ZoomIn,
  Copy,
  Check
} from 'lucide-react';

export interface ProjectLocation {
  id: string;
  campaignId: string;
  title: string;
  district: string;
  state: string;
  category: 'water' | 'medical' | 'crisis' | 'ecology' | 'education' | 'headquarters';
  categoryLabel: string;
  coordinates: [number, number]; // [lat, lng]
  fieldStatus: 'Active Deployment' | 'Emergency Priority' | 'Operational' | 'Audit HQ';
  verifiedSince: string;
  directBeneficiaries: string;
  allocatedFunds: string;
  gpsCoordinates: string;
  streetAddress: string;
  landmark: string;
  summary: string;
  keyMetric: { label: string; value: string };
  frontlinePartner: string;
  isEmergencyMatch?: boolean;
}

export const PROJECT_LOCATIONS: ProjectLocation[] = [
  {
    id: 'loc-barmer',
    campaignId: 'sahel-clean-water',
    title: 'Thar Solar Groundwater RO Well Cluster',
    district: 'Barmer & Jaisalmer',
    state: 'Rajasthan',
    category: 'water',
    categoryLabel: 'Clean Water',
    coordinates: [25.7532, 71.4181],
    fieldStatus: 'Active Deployment',
    verifiedSince: 'Aug 2026',
    directBeneficiaries: '4,200 Households',
    allocatedFunds: '₹17,85,000',
    gpsCoordinates: '25°45\'11.5"N, 71°25\'05.2"E',
    streetAddress: 'National Highway 68 / Chohtan Bypass Road',
    landmark: 'Near Gram Panchayat Wellhead 14, Barmer Desert Basin',
    summary: '16 solar-powered submersible pumps tapping sweet-water aquifers at 180m depth, delivering 60,000L of potably certified water per day.',
    keyMetric: { label: 'Daily Clean Water', value: '60,000 Litres' },
    frontlinePartner: 'Gramin Jal Seva Samiti (Reg. RJ/941)',
    isEmergencyMatch: true
  },
  {
    id: 'loc-mahoba',
    campaignId: 'sahel-clean-water',
    title: 'Bundelkhand Aquifer Rejuvenation Station',
    district: 'Mahoba & Chhatarpur',
    state: 'Uttar Pradesh / MP',
    category: 'water',
    categoryLabel: 'Clean Water',
    coordinates: [25.2924, 79.8722],
    fieldStatus: 'Operational',
    verifiedSince: 'Sep 2026',
    directBeneficiaries: '3,100 Households',
    allocatedFunds: '₹12,40,000',
    gpsCoordinates: '25°17\'32.6"N, 79°52\'19.9"E',
    streetAddress: 'Banda-Mahoba Highway (NH 35), Gandhi Nagar Link',
    landmark: 'Chhatarpur Border Water Panchayat Checkdam',
    summary: 'Multi-grade sand and UV filtration units preventing fluorosis in chronically drought-prone farming panchayats.',
    keyMetric: { label: 'Well Depth', value: '172 Metres' },
    frontlinePartner: 'Bundelkhand Water Panchayat Collective'
  },
  {
    id: 'loc-koraput',
    campaignId: 'pediatric-trauma-units',
    title: 'Eastern Ghats Tribal Neonatal ICU Fleet',
    district: 'Koraput & Malkangiri',
    state: 'Odisha',
    category: 'medical',
    categoryLabel: 'Medical Care',
    coordinates: [18.8135, 82.7123],
    fieldStatus: 'Operational',
    verifiedSince: 'Jul 2026',
    directBeneficiaries: '1,800 Children / Mo',
    allocatedFunds: '₹23,40,000',
    gpsCoordinates: '18°48\'48.6"N, 82°42\'44.3"E',
    streetAddress: 'Sunabeda-Semiliguda Highway (NH 26), Medical Dispatch Hub',
    landmark: 'Near AIIMS Satellite Telemedicine Outpost',
    summary: 'All-terrain 4WD ambulances equipped with vibration-dampened infant incubators and real-time AIIMS satellite telemetry.',
    keyMetric: { label: 'Neonatal Rescues', value: '420 Infants' },
    frontlinePartner: 'Utkal Seva Rural Medical Mission'
  },
  {
    id: 'loc-bastar',
    campaignId: 'pediatric-trauma-units',
    title: 'Dandakaranya Forest Trauma Response Station',
    district: 'Bastar & Dantewada',
    state: 'Chhattisgarh',
    category: 'medical',
    categoryLabel: 'Medical Care',
    coordinates: [19.1071, 81.9535],
    fieldStatus: 'Active Deployment',
    verifiedSince: 'Sep 2026',
    directBeneficiaries: '90km Transit Radius',
    allocatedFunds: '₹15,20,000',
    gpsCoordinates: '19°06\'25.6"N, 81°57\'12.6"E',
    streetAddress: 'Jagdalpur-Dantewada Arterial Road (NH 63)',
    landmark: 'Bastar Tribal Forest Range Gate 4',
    summary: 'Rapid response pediatric patrols providing snakebite anti-venom, sterile incubators, and oxygen triage in deep tribal forest interiors.',
    keyMetric: { label: 'ICU Vehicles', value: '3 Units Active' },
    frontlinePartner: 'Bastar Jan Swasthya Sahayata'
  },
  {
    id: 'loc-majuli',
    campaignId: 'bay-islands-flood-relief',
    title: 'Brahmaputra Flood Triage & Floating RO Barge',
    district: 'Majuli Island',
    state: 'Assam',
    category: 'crisis',
    categoryLabel: 'Crisis Relief',
    coordinates: [26.9535, 94.2185],
    fieldStatus: 'Emergency Priority',
    verifiedSince: 'Oct 2026',
    directBeneficiaries: '6,400 Displaced Families',
    allocatedFunds: '₹30,50,000',
    gpsCoordinates: '26°57\'12.6"N, 94°13\'06.6"E',
    streetAddress: 'Kamalabari Ghat Ferry Road, Brahmaputra Riverfront',
    landmark: 'Majuli Island Relief Mooring Jetty #2',
    summary: '18 motorized rescue skiffs and solar-powered floating water purification barge offloading fresh rations to flooded riverine island settlements.',
    keyMetric: { label: 'Rescue Missions', value: '380 Sorties' },
    frontlinePartner: 'Assam Disaster Relief Corps (SDRF affiliated)',
    isEmergencyMatch: true
  },
  {
    id: 'loc-sundarbans',
    campaignId: 'bay-islands-flood-relief',
    title: 'Sundarbans Delta Embankment Aid Hub',
    district: 'South 24 Parganas',
    state: 'West Bengal',
    category: 'crisis',
    categoryLabel: 'Crisis Relief',
    coordinates: [21.9497, 88.8999],
    fieldStatus: 'Active Deployment',
    verifiedSince: 'Oct 2026',
    directBeneficiaries: '12 Inundated Hamlets',
    allocatedFunds: '₹14,80,000',
    gpsCoordinates: '21°56\'58.9"N, 88°53\'59.6"E',
    streetAddress: 'Gosaba-Basanti Ferry Link & Flood Embankment Road',
    landmark: 'Bidhyadhari River Estuary Outpost',
    summary: 'Mobile cyclone-shelter clinic distributing 22,000 dry ration packs and water purification tablets across remote mangrove channels.',
    keyMetric: { label: 'Dry Rations', value: '22,000 Kits' },
    frontlinePartner: 'Delta Mangrove Fisherfolk Seva'
  },
  {
    id: 'loc-nilgiris',
    campaignId: 'cloud-forest-sanctuary',
    title: 'Western Ghats Shola Biodiversity Sanctuary',
    district: 'Nilgiris & Silent Valley',
    state: 'Tamil Nadu & Kerala',
    category: 'ecology',
    categoryLabel: 'Ecology',
    coordinates: [11.4102, 76.6950],
    fieldStatus: 'Operational',
    verifiedSince: 'May 2026',
    directBeneficiaries: '8,500 Hectares Protected',
    allocatedFunds: '₹13,95,000',
    gpsCoordinates: '11°24\'36.7"N, 76°41\'42.0"E',
    streetAddress: 'Ooty-Kotagiri Road (SH 15), Doddabetta Ridge Route',
    landmark: 'Toda Indigenous Community Forest Checkpoint',
    summary: 'Continuous mountain cloud-forest corridor conserved in partnership with 38 indigenous Toda and Kurumba rangers.',
    keyMetric: { label: 'Species Safeguarded', value: '64 Endangered' },
    frontlinePartner: 'Nilgiri Indigenous Forest Wardens Council'
  },
  {
    id: 'loc-jhunjhunu',
    campaignId: 'girls-stem-literacy',
    title: 'Kasturba Rural Girls Solar Robotics Lab',
    district: 'Jhunjhunu & Sikar',
    state: 'Rajasthan',
    category: 'education',
    categoryLabel: 'Education',
    coordinates: [28.1289, 75.3995],
    fieldStatus: 'Operational',
    verifiedSince: 'Jun 2026',
    directBeneficiaries: '1,500 Students Annually',
    allocatedFunds: '₹10,80,000',
    gpsCoordinates: '28°07\'44.0"N, 75°23\'58.2"E',
    streetAddress: 'Jhunjhunu-Mandawa Bypass Road, Near Railway Crossing',
    landmark: 'Kasturba Balika Senior Secondary Campus',
    summary: '10 kW rooftop solar laboratory equipped with 30 offline bilingual tablets, digital microscopes, and Arduino robotics kits.',
    keyMetric: { label: 'Scholarships Funded', value: '420 Girls' },
    frontlinePartner: 'Sharda Balika Shiksha Foundation'
  },
  {
    id: 'loc-delhi-hq',
    campaignId: 'sahel-clean-water',
    title: 'Kindred Horizons Central Audit & Escrow Treasury',
    district: 'Connaught Place',
    state: 'New Delhi',
    category: 'headquarters',
    categoryLabel: 'Statutory HQ',
    coordinates: [28.6328, 77.2197],
    fieldStatus: 'Audit HQ',
    verifiedSince: 'Registered 2023',
    directBeneficiaries: 'National Project Oversight',
    allocatedFunds: '₹12.4 Cr Dispatched',
    gpsCoordinates: '28°37\'58.1"N, 77°13\'10.9"E',
    streetAddress: 'Barakhamba Road, Connaught Place Outer Circle',
    landmark: 'Adjacent to Statesman House & Barakhamba Metro Station',
    summary: 'Central statutory headquarters administering escrow disbursements, Chartered Accountant audits, and Section 80G Form 10BD/10BE filings.',
    keyMetric: { label: 'Section 80G', value: 'CIT(E) Certified' },
    frontlinePartner: 'Managing Trustees & Statutory CA Panel'
  }
];

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; pin: string; badge: string }> = {
  water: {
    bg: 'bg-cyan-600',
    border: 'border-cyan-700',
    text: 'text-cyan-800',
    pin: '#0891b2',
    badge: 'bg-cyan-50 text-cyan-800 border-cyan-200'
  },
  medical: {
    bg: 'bg-rose-600',
    border: 'border-rose-700',
    text: 'text-rose-800',
    pin: '#e11d48',
    badge: 'bg-rose-50 text-rose-800 border-rose-200'
  },
  crisis: {
    bg: 'bg-amber-600',
    border: 'border-amber-700',
    text: 'text-amber-800',
    pin: '#d97706',
    badge: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  ecology: {
    bg: 'bg-emerald-600',
    border: 'border-emerald-700',
    text: 'text-emerald-800',
    pin: '#059669',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  education: {
    bg: 'bg-indigo-600',
    border: 'border-indigo-700',
    text: 'text-indigo-800',
    pin: '#4f46e5',
    badge: 'bg-indigo-50 text-indigo-800 border-indigo-200'
  },
  headquarters: {
    bg: 'bg-stone-800',
    border: 'border-stone-900',
    text: 'text-stone-800',
    pin: '#1c1917',
    badge: 'bg-stone-100 text-stone-900 border-stone-300'
  }
};

type TileLayerType = 'streets' | 'osm' | 'hybrid';

interface ProjectLocationsMapProps {
  onOpenDonate?: (campaignId?: string) => void;
  onOpenFieldReport?: (campaignId: string) => void;
}

export const ProjectLocationsMap: React.FC<ProjectLocationsMapProps> = ({
  onOpenDonate,
  onOpenFieldReport
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const activeTileLayersRef = useRef<L.Layer[]>([]);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<ProjectLocation | null>(PROJECT_LOCATIONS[0]);
  const [mapTileStyle, setMapTileStyle] = useState<TileLayerType>('streets');
  const [currentZoom, setCurrentZoom] = useState<number>(5);
  const [copiedGps, setCopiedGps] = useState<boolean>(false);

  const filteredLocations = activeCategory === 'all'
    ? PROJECT_LOCATIONS
    : PROJECT_LOCATIONS.filter(loc => loc.category === activeCategory);

  // Custom dispatch events from Leaflet popups
  useEffect(() => {
    const handleMapDonate = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (onOpenDonate && customEvent.detail) {
        onOpenDonate(customEvent.detail);
      }
    };

    const handleMapReport = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (onOpenFieldReport && customEvent.detail) {
        onOpenFieldReport(customEvent.detail);
      }
    };

    window.addEventListener('kh-map-donate', handleMapDonate);
    window.addEventListener('kh-map-report', handleMapReport);

    return () => {
      window.removeEventListener('kh-map-donate', handleMapDonate);
      window.removeEventListener('kh-map-report', handleMapReport);
    };
  }, [onOpenDonate, onOpenFieldReport]);

  // Helper function to mount tiles cleanly
  const applyTileLayers = (map: L.Map, style: TileLayerType) => {
    // Remove existing tile layers
    activeTileLayersRef.current.forEach(layer => {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
    activeTileLayersRef.current = [];

    if (style === 'streets') {
      // Esri World Street Map - High-clarity road networks, street names, landmarks, highways
      const streetLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; Esri, DeLorme, NAVTEQ, TomTom &mdash; High-Clarity Street Map',
          maxZoom: 19
        }
      ).addTo(map);
      activeTileLayersRef.current.push(streetLayer);
    } else if (style === 'osm') {
      // OpenStreetMap Detailed - Comprehensive community road & street network down to alleys
      const osmLayer = L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }
      ).addTo(map);
      activeTileLayersRef.current.push(osmLayer);
    } else if (style === 'hybrid') {
      // Esri World Imagery (Satellite) + High-contrast Street & Transportation Overlay
      const satelliteBase = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; Esri, Maxar, Earthstar Geographics',
          maxZoom: 19
        }
      ).addTo(map);

      const streetsOverlay = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19
        }
      ).addTo(map);

      const labelsOverlay = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19
        }
      ).addTo(map);

      activeTileLayersRef.current.push(satelliteBase, streetsOverlay, labelsOverlay);
    }
  };

  // Initialize Leaflet Map with persistent dimensions & robust invalidateSize calls
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Reset potential existing leaflet instance container ID to prevent "already initialized" errors
    const container = mapContainerRef.current as HTMLDivElement & { _leaflet_id?: number | null };
    if (container._leaflet_id) {
      container._leaflet_id = null;
    }

    // Centered on central India
    const map = L.map(container, {
      center: [22.8, 80.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false,
      scrollWheelZoom: true
    });

    mapInstanceRef.current = map;

    // Add zoom controls at top right for easy access
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Apply default clear street tiles
    applyTileLayers(map, 'streets');

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    // Multi-stage invalidation to guarantee full tile rasterization immediately
    const invalidate = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    invalidate();
    const timers = [
      setTimeout(invalidate, 50),
      setTimeout(invalidate, 150),
      setTimeout(invalidate, 350),
      setTimeout(invalidate, 700),
      setTimeout(invalidate, 1200)
    ];

    // ResizeObserver ensures map.invalidateSize() runs whenever the container dimension adjusts
    const resizeObserver = new ResizeObserver(() => {
      invalidate();
    });
    resizeObserver.observe(container);

    window.addEventListener('resize', invalidate);

    return () => {
      timers.forEach(t => clearTimeout(t));
      window.removeEventListener('resize', invalidate);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = {};
      activeTileLayersRef.current = [];
    };
  }, []);

  // Update tile layer if style changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    applyTileLayers(mapInstanceRef.current, mapTileStyle);
  }, [mapTileStyle]);

  // Sync Markers with filteredLocations
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove existing markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    filteredLocations.forEach(loc => {
      const color = CATEGORY_COLORS[loc.category] || CATEGORY_COLORS.water;
      const isSelected = selectedLocation?.id === loc.id;
      const hasRadar = loc.isEmergencyMatch;

      // Custom HTML Marker using L.divIcon
      const iconHtml = `
        <div class="relative group cursor-pointer" style="transform: translate(-50%, -50%);">
          ${hasRadar ? `<span class="absolute -inset-2.5 rounded-full ${color.bg} opacity-40 animate-ping"></span>` : ''}
          <div class="custom-marker-ring w-9 h-9 rounded-full ${color.bg} border-2 ${isSelected ? 'border-stone-950 scale-125 ring-4 ring-amber-400' : 'border-white shadow-lg'} flex items-center justify-center transition-all duration-300">
            <span class="w-3 h-3 rounded-full bg-white shadow-xs"></span>
          </div>
          <div class="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-stone-900 rotate-45 shadow-xs"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: iconHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker(loc.coordinates, { icon: customIcon }).addTo(map);

      // Interactive Popup Content with Street-Level Details
      const popupHtml = `
        <div style="font-family: inherit; min-width: 270px; padding: 6px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: ${color.pin};">
              ${loc.categoryLabel}
            </span>
            <span style="font-size: 10px; font-family: monospace; background: #f5f5f4; padding: 2px 6px; border-radius: 4px; color: #44403c; border: 1px solid #e7e5e4;">
              ${loc.fieldStatus}
            </span>
          </div>
          <div style="font-weight: 700; font-size: 14px; color: #1c1917; margin-bottom: 3px; line-height: 1.3;">
            ${loc.title}
          </div>
          <div style="font-size: 11px; font-weight: 500; color: #44403c; margin-bottom: 2px;">
            ${loc.streetAddress}
          </div>
          <div style="font-size: 10px; color: #78716c; margin-bottom: 8px;">
            ${loc.landmark} &middot; ${loc.district}, ${loc.state}
          </div>
          <div style="background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 6px; padding: 6px 8px; margin-bottom: 8px; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #78716c;">Allocated Seva:</span>
              <strong style="color: #1c1917;">${loc.allocatedFunds}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #78716c;">Output:</span>
              <strong style="color: #047857;">${loc.keyMetric.value}</strong>
            </div>
          </div>
          <div style="display: flex; gap: 6px; margin-top: 6px;">
            <button onclick="window.dispatchEvent(new CustomEvent('kh-map-donate', { detail: '${loc.campaignId}' }))" style="flex: 1; background: #1c1917; color: #ffffff; border: none; border-radius: 6px; padding: 7px 10px; font-size: 11px; font-weight: 600; cursor: pointer;">
              Support Site (₹)
            </button>
            <button onclick="window.dispatchEvent(new CustomEvent('kh-map-report', { detail: '${loc.campaignId}' }))" style="background: #f5f5f4; color: #1c1917; border: 1px solid #d6d3d1; border-radius: 6px; padding: 7px 10px; font-size: 11px; font-weight: 600; cursor: pointer;">
              Field Log
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'kh-custom-popup',
        offset: [0, -16],
        closeButton: true
      });

      marker.on('click', () => {
        setSelectedLocation(loc);
        map.flyTo(loc.coordinates, 14, { duration: 0.9 });
      });

      markersRef.current[loc.id] = marker;
    });
  }, [filteredLocations]);

  // Update active marker ring styling when selectedLocation changes
  useEffect(() => {
    if (!selectedLocation) return;
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const isSelected = id === selectedLocation.id;
      const el = marker.getElement();
      if (el) {
        const ring = el.querySelector('.custom-marker-ring');
        if (ring) {
          if (isSelected) {
            ring.classList.add('border-stone-950', 'scale-125', 'ring-4', 'ring-amber-400');
            ring.classList.remove('border-white', 'shadow-lg');
          } else {
            ring.classList.remove('border-stone-950', 'scale-125', 'ring-4', 'ring-amber-400');
            ring.classList.add('border-white', 'shadow-lg');
          }
        }
      }
    });
  }, [selectedLocation]);

  // Fly to selected location at high-clarity street level (Zoom 14)
  const handleSelectLocation = (loc: ProjectLocation, targetZoom = 14) => {
    setSelectedLocation(loc);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(loc.coordinates, targetZoom, {
        duration: 1.1,
        easeLinearity: 0.25
      });
      const marker = markersRef.current[loc.id];
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 800);
      }
    }
    // On mobile screens, scroll map into view smoothly
    if (window.innerWidth < 1024 && mapContainerRef.current) {
      mapContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleZoomLevel = (zoom: number) => {
    if (!mapInstanceRef.current) return;
    if (selectedLocation && zoom >= 10) {
      mapInstanceRef.current.flyTo(selectedLocation.coordinates, zoom, { duration: 0.8 });
    } else {
      mapInstanceRef.current.flyTo([22.8, 80.5], zoom, { duration: 0.8 });
    }
  };

  const handleCopyGps = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedGps(true);
    setTimeout(() => setCopiedGps(false), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'water':
        return Droplets;
      case 'medical':
        return HeartPulse;
      case 'crisis':
        return Flame;
      case 'ecology':
        return TreePine;
      case 'education':
        return GraduationCap;
      case 'headquarters':
        return Building;
      default:
        return MapPin;
    }
  };

  return (
    <div id="field-map" className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm scroll-mt-24">
      {/* Top Bar Header */}
      <div className="p-5 sm:p-6 border-b border-stone-200 bg-stone-50/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
            <Compass className="w-3.5 h-3.5 text-stone-700" />
            <span>Audited Geographic Verification · India Project Map</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold">9 Active Frontline Sites</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-semibold text-stone-900 flex items-center gap-2">
            <span>High-Clarity Street & Project Map</span>
            <Globe className="w-4 h-4 text-stone-500 hidden sm:inline" />
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Trace every allocated Rupee to exact street addresses, highway coordinates, village water plants, mobile ICU routes, and river triage barges.
          </p>
        </div>

        {/* Map Tile Layers & View Quick-Zoom Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tile Layer Selector */}
          <div className="inline-flex rounded-lg border border-stone-200 bg-white p-0.5 text-xs font-mono shadow-xs">
            <button
              type="button"
              onClick={() => setMapTileStyle('streets')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                mapTileStyle === 'streets'
                  ? 'bg-stone-900 text-white font-medium shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
              title="Clear high-definition street, highway, and landmark map"
            >
              <Layers className="w-3 h-3" />
              <span>Clear Streets</span>
            </button>
            <button
              type="button"
              onClick={() => setMapTileStyle('osm')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                mapTileStyle === 'osm'
                  ? 'bg-stone-900 text-white font-medium shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
              title="OpenStreetMap detailed road network and village paths"
            >
              OSM Roads
            </button>
            <button
              type="button"
              onClick={() => setMapTileStyle('hybrid')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                mapTileStyle === 'hybrid'
                  ? 'bg-stone-900 text-white font-medium shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
              title="Satellite imagery with street grid overlay"
            >
              Satellite + Roads
            </button>
          </div>

          {/* Quick Zoom Presets */}
          <div className="inline-flex rounded-lg border border-stone-200 bg-white p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => handleZoomLevel(14)}
              className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                currentZoom >= 13
                  ? 'bg-amber-100 text-amber-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Zoom directly into street level to see roads and building perimeters"
            >
              <ZoomIn className="w-3 h-3" />
              <span>Street (14x)</span>
            </button>
            <button
              type="button"
              onClick={() => handleZoomLevel(10)}
              className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                currentZoom >= 9 && currentZoom < 13
                  ? 'bg-stone-200 text-stone-900 font-medium'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="District/Tehsil view"
            >
              District (10x)
            </button>
            <button
              type="button"
              onClick={() => handleZoomLevel(5)}
              className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                currentZoom < 9
                  ? 'bg-stone-200 text-stone-900 font-medium'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="All-India View"
            >
              <Maximize2 className="w-3 h-3" />
              <span>India (5x)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="px-5 py-3 border-b border-stone-200 bg-white flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-xs font-mono text-stone-400 mr-2 shrink-0">Filter Projects:</span>
        {[
          { id: 'all', label: 'All Projects (9)' },
          { id: 'water', label: 'Clean Water' },
          { id: 'medical', label: 'Medical ICU' },
          { id: 'crisis', label: 'Crisis Relief' },
          { id: 'ecology', label: 'Ecology' },
          { id: 'education', label: 'Girls STEM' },
          { id: 'headquarters', label: 'Statutory HQ' }
        ].map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 text-xs rounded-md transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-stone-900 text-white font-medium shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Map + Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px] lg:min-h-[640px]">
        {/* Leaflet Map Canvas with Dedicated Physical Height */}
        <div className="lg:col-span-7 xl:col-span-8 relative bg-stone-100 flex flex-col">
          {/* Explicit height guarantees instant canvas allocation without collapsing */}
          <div
            ref={mapContainerRef}
            className="w-full h-[480px] sm:h-[560px] lg:h-[640px] relative z-0 focus:outline-none"
            style={{ minHeight: '480px' }}
          />

          {/* Map Overlay Badge */}
          <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xs border border-stone-200 shadow-md rounded-lg px-3 py-1.5 text-xs font-mono text-stone-700 flex items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-stone-800">Clear Street Level Enabled</span>
            <span className="text-stone-400 hidden sm:inline">&middot; Zoom {currentZoom}x</span>
          </div>

          {/* Quick Legend at Bottom-Left */}
          <div className="absolute bottom-3 left-3 z-10 bg-stone-900/90 backdrop-blur-xs text-white text-[11px] font-mono px-3 py-2 rounded-lg shadow-md hidden sm:flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Water
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Medical
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Crisis
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Ecology
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span> STEM
            </span>
          </div>
        </div>

        {/* Sidebar: Selected Project Dossier & Locations List */}
        <div className="lg:col-span-5 xl:col-span-4 border-t lg:border-t-0 lg:border-l border-stone-200 flex flex-col bg-white">
          {/* Active Location Dossier Header */}
          {selectedLocation ? (
            <div className="p-5 border-b border-stone-200 bg-stone-50/60">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md border ${CATEGORY_COLORS[selectedLocation.category]?.badge || 'bg-stone-100 text-stone-700'}`}>
                  {selectedLocation.categoryLabel}
                </span>
                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{selectedLocation.fieldStatus}</span>
                </span>
              </div>

              <h4 className="text-base font-serif font-bold text-stone-900 leading-snug">
                {selectedLocation.title}
              </h4>

              {/* Exact Street & Location Details */}
              <div className="mt-2 p-2.5 bg-white rounded-lg border border-stone-200 text-xs space-y-1">
                <div className="flex items-start gap-1.5 font-medium text-stone-900">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{selectedLocation.streetAddress}</span>
                </div>
                <div className="text-[11px] text-stone-500 pl-5">
                  Landmark: {selectedLocation.landmark}
                </div>
                <div className="text-[11px] font-mono text-stone-600 pl-5 flex items-center justify-between pt-1 border-t border-stone-100">
                  <span>{selectedLocation.district}, {selectedLocation.state}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyGps(selectedLocation.gpsCoordinates)}
                    className="text-stone-400 hover:text-stone-800 transition-colors cursor-pointer flex items-center gap-1"
                    title="Copy exact GPS Coordinates"
                  >
                    {copiedGps ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{selectedLocation.gpsCoordinates}</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                {selectedLocation.summary}
              </p>

              {/* Stat Boxes */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-white p-2 rounded-lg border border-stone-200">
                  <div className="text-[10px] font-mono uppercase text-stone-400">Allocated Seva</div>
                  <div className="text-sm font-serif font-bold text-stone-900 mt-0.5">
                    {selectedLocation.allocatedFunds}
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-stone-200">
                  <div className="text-[10px] font-mono uppercase text-stone-400">{selectedLocation.keyMetric.label}</div>
                  <div className="text-sm font-serif font-bold text-emerald-800 mt-0.5">
                    {selectedLocation.keyMetric.value}
                  </div>
                </div>
              </div>

              {/* Frontline Partner */}
              <div className="mt-2.5 text-[11px] text-stone-500 font-mono">
                <span className="text-stone-400">Partner: </span>
                <span className="text-stone-700">{selectedLocation.frontlinePartner}</span>
              </div>

              {/* Street Zoom & External Navigation Triggers */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectLocation(selectedLocation, 15)}
                  className="flex-1 py-1.5 px-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-medium text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="Zoom into street and road level for this site"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Zoom Street View (15x)</span>
                </button>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.coordinates[0]},${selectedLocation.coordinates[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-2.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs rounded-lg flex items-center gap-1 transition-colors"
                  title="Open in Google Maps in new tab"
                >
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                  <span>Google Maps</span>
                </a>
              </div>

              {/* Support & Field Log Actions */}
              <div className="mt-2 flex items-center gap-2">
                {selectedLocation.campaignId && onOpenDonate && (
                  <button
                    type="button"
                    onClick={() => onOpenDonate(selectedLocation.campaignId)}
                    className="flex-1 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Support This Site</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {selectedLocation.campaignId && onOpenFieldReport && (
                  <button
                    type="button"
                    onClick={() => onOpenFieldReport(selectedLocation.campaignId)}
                    className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="View Full Verified Field Report"
                  >
                    <span>Field Log</span>
                    <ExternalLink className="w-3 h-3 text-stone-500" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-5 border-b border-stone-200 text-xs text-stone-500 text-center">
              Click any project marker on the map or select from the list below.
            </div>
          )}

          {/* Scrollable Project Locations List */}
          <div className="p-3 overflow-y-auto max-h-[320px] divide-y divide-stone-100">
            <div className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-stone-400">
              Verified Project Stations ({filteredLocations.length})
            </div>
            {filteredLocations.map(loc => {
              const isSelected = selectedLocation?.id === loc.id;
              const IconComponent = getCategoryIcon(loc.category);
              const color = CATEGORY_COLORS[loc.category] || CATEGORY_COLORS.water;

              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelectLocation(loc, 14)}
                  className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/90 border border-amber-300'
                      : 'hover:bg-stone-50'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-md ${color.bg} text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs`}>
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-xs text-stone-900 truncate">
                        {loc.title}
                      </div>
                      <span className="text-[10px] font-mono text-stone-500 shrink-0">
                        {loc.district}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 truncate mt-0.5">
                      {loc.streetAddress}
                    </div>
                    <div className="text-[11px] text-stone-500 flex items-center justify-between mt-0.5">
                      <span>{loc.state}</span>
                      <strong className="text-stone-800 font-mono text-[11px]">
                        {loc.allocatedFunds}
                      </strong>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Institutional Audit Footnote */}
      <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 font-mono">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All coordinates, street locations, and physical outputs cross-verified by independent field assessors.</span>
        </div>
        <div className="text-stone-400 text-[11px]">
          Form 10BD Statutory Ledger Tag: #KH-GEO-2026-IND
        </div>
      </div>
    </div>
  );
};
