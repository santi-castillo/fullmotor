/**
 * 301 redirects for vehicle slugs normalised on 2026-08-05.
 *
 * The old slugs contained characters that are invalid in a URL path —
 * parentheses, commas, colons, plus signs — and were live in the sitemap, so
 * they must keep resolving instead of 404ing.
 *
 * Generated from scripts/cleanup_slugs.sql in the API repo; the two must stay
 * in sync. Do not edit by hand.
 */
export const VEHICLE_SLUG_REDIRECTS: { from: string; to: string }[] = [
  { from: "uy-changan-cs55-plus-2025-idd-1.5-phev-elite-e-cvt", to: "uy-changan-cs55-plus-2025-idd-15-phev-elite-e-cvt" },
  { from: "uy-changan-eado-plus-2025-idd-1.5-phev-elite-e-cvt", to: "uy-changan-eado-plus-2025-idd-15-phev-elite-e-cvt" },
  { from: "uy-changan-eado-plus-2025-idd-1.5-phev-luxury-e-cvt", to: "uy-changan-eado-plus-2025-idd-15-phev-luxury-e-cvt" },
  { from: "uy-changan-hunter-2025-reev-2.0t-elite-4x4-a-t", to: "uy-changan-hunter-2025-reev-20t-elite-4x4-a-t" },
  { from: "uy-changan-hunter-2025-reev-2.0t-luxury-4x2-a-t", to: "uy-changan-hunter-2025-reev-20t-luxury-4x2-a-t" },
  { from: "uy-changan-uni-t-2025-1.5-300t-gdi-techno-dct", to: "uy-changan-uni-t-2025-15-300t-gdi-techno-dct" },
  { from: "uy-changan-x7-plus-2025-1.5-260t-gdi-luxury-m-t", to: "uy-changan-x7-plus-2025-15-260t-gdi-luxury-m-t" },
  { from: "uy-changan-x7-plus-2025-1.5-300t-gdi-elite-dct", to: "uy-changan-x7-plus-2025-15-300t-gdi-elite-dct" },
  { from: "uy-changan-x7-plus-2025-1.5-300t-gdi-luxury-dct", to: "uy-changan-x7-plus-2025-15-300t-gdi-luxury-dct" },
  { from: "uy-gac-motor-emzoom-2025-15-t-gb+-a-t", to: "uy-gac-motor-emzoom-2025-15-t-gb-a-t" },
  { from: "uy-gac-motor-emzoom-2025-15-t-gl+-a-t", to: "uy-gac-motor-emzoom-2025-15-t-gl-a-t" },
  { from: "uy-geely-coolray-lite-2025-gs+-15-cvt", to: "uy-geely-coolray-lite-2025-gs-15-cvt" },
  { from: "uy-honda-cr-v-2025-e:hev-20-e-cvt-awd", to: "uy-honda-cr-v-2025-e-hev-20-e-cvt-awd" },
  { from: "uy-jetour-dashing-2025-comfort-1.5-tci-dct", to: "uy-jetour-dashing-2025-comfort-15-tci-dct" },
  { from: "uy-jetour-t1-2025-1.5t-290t-gdi-7dct-fwd", to: "uy-jetour-t1-2025-15t-290t-gdi-7dct-fwd" },
  { from: "uy-jetour-t1-2025-phev-1.5td-1-dht", to: "uy-jetour-t1-2025-phev-15td-1-dht" },
  { from: "uy-jetour-t2-2025-phev-1.5td-3-dht", to: "uy-jetour-t2-2025-phev-15td-3-dht" },
  { from: "uy-jetour-t2-2025-traveller-2.0t-390t-gdi-7dct-xwd", to: "uy-jetour-t2-2025-traveller-20t-390t-gdi-7dct-xwd" },
  { from: "uy-jetour-x50-2025-comfort-1.5-m-t", to: "uy-jetour-x50-2025-comfort-15-m-t" },
  { from: "uy-jetour-x50-2025-premium-1.5t-dct", to: "uy-jetour-x50-2025-premium-15t-dct" },
  { from: "uy-jetour-x70-2025-comfort-1.5t-m-t", to: "uy-jetour-x70-2025-comfort-15t-m-t" },
  { from: "uy-jetour-x70-2025-luxury-1.5t-dct", to: "uy-jetour-x70-2025-luxury-15t-dct" },
  { from: "uy-jetour-x70-2025-luxury-1.5t-m-t", to: "uy-jetour-x70-2025-luxury-15t-m-t" },
  { from: "uy-kgm-torres-evx-2025-2wd-(734-kwh)", to: "uy-kgm-torres-evx-2025-2wd-734-kwh" },
  { from: "uy-kia-ev3-light+-2025-2wd-long-range", to: "uy-kia-ev3-light-2025-2wd-long-range" },
  { from: "uy-lynk-and-co-02-2025-halo-ev-(66-kwh)", to: "uy-lynk-and-co-02-2025-halo-ev-66-kwh" },
  { from: "uy-lynk-and-co-02-2025-pro-ev-(66-kwh)", to: "uy-lynk-and-co-02-2025-pro-ev-66-kwh" },
  { from: "uy-mg-4-2025-deluxe-awd-(64-kwh)", to: "uy-mg-4-2025-deluxe-awd-64-kwh" },
  { from: "uy-mg-4-2025-deluxe-extended-range-2wd-(77-kwh)", to: "uy-mg-4-2025-deluxe-extended-range-2wd-77-kwh" },
  { from: "uy-mg-4-2025-standard-2wd-(51-kwh)", to: "uy-mg-4-2025-standard-2wd-51-kwh" },
  { from: "uy-mg-cyberster-2025-deluxe-awd-(77-kwh)", to: "uy-mg-cyberster-2025-deluxe-awd-77-kwh" },
  { from: "uy-mg-zs-ev-2025-comfort-2wd-(50,3-kwh)", to: "uy-mg-zs-ev-2025-comfort-2wd-503-kwh" },
  { from: "uy-mg-zs-ev-2025-deluxe-2wd-(50,3-kwh)", to: "uy-mg-zs-ev-2025-deluxe-2wd-503-kwh" },
  { from: "uy-noderal-s7-2025-exclusive-(57-kwh)", to: "uy-noderal-s7-2025-exclusive-57-kwh" },
  { from: "uy-noderal-s7-2025-luxury-(57-kwh)", to: "uy-noderal-s7-2025-luxury-57-kwh" },
  { from: "uy-noderal-t5-2025-friday-luxury-(49,27-kwh)", to: "uy-noderal-t5-2025-friday-luxury-4927-kwh" },
  { from: "uy-omoda-and-jaecoo-jaecoo-5-ev-2025-luxury-(58,9-kwh)", to: "uy-omoda-and-jaecoo-jaecoo-5-ev-2025-luxury-589-kwh" },
  { from: "uy-omoda-and-jaecoo-jaecoo-6-ev-2025-flagship-iwd-(69,77-kwh)-awd", to: "uy-omoda-and-jaecoo-jaecoo-6-ev-2025-flagship-iwd-6977-kwh-awd" },
  { from: "uy-omoda-and-jaecoo-jaecoo-6-ev-2025-luxury-2wd-(65,69-kwh)", to: "uy-omoda-and-jaecoo-jaecoo-6-ev-2025-luxury-2wd-6569-kwh" },
  { from: "uy-omoda-and-jaecoo-omoda-e5-2025-comfort-(61-kwh)", to: "uy-omoda-and-jaecoo-omoda-e5-2025-comfort-61-kwh" },
  { from: "uy-omoda-and-jaecoo-omoda-e5-2025-luxury-(61-kwh)", to: "uy-omoda-and-jaecoo-omoda-e5-2025-luxury-61-kwh" },
]
