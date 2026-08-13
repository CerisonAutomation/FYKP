'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { User } from '@/types';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face';

interface MapViewProps {
  users: (User & { distance?: number | null })[];
  centerLat: number;
  centerLng: number;
  radius: number;
  onUserClick: (userId: string) => void;
}

export default function MapViewComponent({ users, centerLat, centerLng, radius, onUserClick }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 12,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark themed tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Radius circle
    const circle = L.circle([centerLat, centerLng], {
      radius: radius * 1000,
      color: '#a855f7',
      fillColor: '#a855f7',
      fillOpacity: 0.08,
      weight: 1,
      opacity: 0.3,
    }).addTo(map);

    // Center marker
    const centerIcon = L.divIcon({
      className: '',
      html: `<div style="width:16px;height:16px;background:#a855f7;border-radius:50%;border:3px solid #fff;box-shadow:0 0 10px rgba(168,85,247,0.6);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    L.marker([centerLat, centerLng], { icon: centerIcon }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when users change
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    users.forEach(user => {
      if (!user.lat || !user.lng) return;

      const avatarUrl = user.avatar || DEFAULT_AVATAR;
      const onlineColor = user.online ? '#22c55e' : '#6b7280';
      const verifiedBadge = user.isVerified ? `<div style="position:absolute;top:-2px;right:-2px;width:12px;height:12px;background:#3b82f6;border-radius:50%;border:2px solid #1a1a2e;display:flex;align-items:center;justify-content:center;"><span style="font-size:7px;color:white;">✓</span></div>` : '';
      const premiumBadge = user.isPremium ? `<div style="position:absolute;top:-2px;left:-2px;width:12px;height:12px;background:#eab308;border-radius:50%;border:2px solid #1a1a2e;display:flex;align-items:center;justify-content:center;"><span style="font-size:7px;color:white;">★</span></div>` : '';

      const icon = L.divIcon({
        className: '',
        html: `<div style="position:relative;cursor:pointer;">
          ${verifiedBadge}${premiumBadge}
          <div style="width:40px;height:40px;border-radius:50%;overflow:hidden;border:2px solid ${onlineColor};box-shadow:0 2px 8px rgba(0,0,0,0.4);">
            <img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'" />
          </div>
          ${user.distance != null ? `<div style="text-align:center;font-size:9px;color:#a1a1aa;margin-top:2px;white-space:nowrap;">${user.distance}km</div>` : ''}
        </div>`,
        iconSize: [40, user.distance != null ? 52 : 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([user.lat, user.lng], { icon }).addTo(mapRef.current);
      marker.on('click', () => onUserClick(user.id));
      markersRef.current.push(marker);
    });
  }, [users, onUserClick]);

  // Update radius circle
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.eachLayer(layer => {
      if (layer instanceof L.Circle) {
        layer.setRadius(radius * 1000);
      }
    });
  }, [radius]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
