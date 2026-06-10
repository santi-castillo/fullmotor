/* TodoMotor UI kit — shared data + chrome. Exposes window.TMK. */

const VEHICLES = [
  { id:'vw-taos-highline', brand:'Volkswagen', model:'Taos', trim:'Highline 250 TSI 1.4 A/T', year:2026, price:42390, power:150, fuel:'nafta', cat:'suvs', condition:'Nuevo', torque:'250 Nm', accel:'8,9 s', cc:'1.4 L', caja:'DSG 6v', traccion:'Delantera', tanque:'51 L', consumo:'14,1 km/L', largo:'4.461 mm', baul:'498 L' },
  { id:'vw-taos-comfort', brand:'Volkswagen', model:'Taos', trim:'Comfortline 250 TSI 1.4 A/T', year:2026, price:40390, power:150, fuel:'nafta', cat:'suvs', condition:'Nuevo', torque:'250 Nm', accel:'9,1 s', cc:'1.4 L', caja:'DSG 6v', traccion:'Delantera', tanque:'51 L', consumo:'14,1 km/L', largo:'4.461 mm', baul:'498 L' },
  { id:'toyota-bz4x-awd', brand:'Toyota', model:'bZ4X', trim:'Limited AWD-i', year:2026, price:52990, power:338, fuel:'electrico', cat:'suvs', condition:'Nuevo', torque:'337 Nm', accel:'6,9 s', cc:'71,4 kWh', caja:'Automática', traccion:'AWD', tanque:'71,4 kWh', consumo:'460 km', largo:'4.690 mm', baul:'452 L' },
  { id:'toyota-bz4x-2wd', brand:'Toyota', model:'bZ4X', trim:'Limited 2WD', year:2026, price:49990, power:221, fuel:'electrico', cat:'suvs', condition:'Nuevo', torque:'266 Nm', accel:'7,5 s', cc:'71,4 kWh', caja:'Automática', traccion:'Delantera', tanque:'71,4 kWh', consumo:'513 km', largo:'4.690 mm', baul:'452 L' },
  { id:'renault-boreal-iconic', brand:'Renault', model:'Boreal', trim:'Iconic 1.3 TCe EDC6', year:2026, price:41000, power:156, fuel:'nafta', cat:'suvs', condition:'Nuevo', torque:'270 Nm', accel:'9,4 s', cc:'1.3 L', caja:'EDC 6v', traccion:'Delantera', tanque:'50 L', consumo:'15,2 km/L', largo:'4.560 mm', baul:'522 L' },
  { id:'renault-boreal-evo', brand:'Renault', model:'Boreal', trim:'Evolution 1.3 TCe EDC6', year:2026, price:36000, power:156, fuel:'nafta', cat:'suvs', condition:'Nuevo', torque:'270 Nm', accel:'9,4 s', cc:'1.3 L', caja:'EDC 6v', traccion:'Delantera', tanque:'50 L', consumo:'15,2 km/L', largo:'4.560 mm', baul:'522 L' },
  { id:'corolla-cross-hv', brand:'Toyota', model:'Corolla Cross', trim:'XLI Hybrid e-CVT', year:2026, price:38900, power:122, fuel:'hibrido', cat:'suvs', condition:'Nuevo', torque:'185 Nm', accel:'9,1 s', cc:'1.8 L', caja:'e-CVT', traccion:'Delantera', tanque:'36 L', consumo:'24,0 km/L', largo:'4.460 mm', baul:'440 L' },
  { id:'corolla-xei', brand:'Toyota', model:'Corolla', trim:'XEi 2.0 CVT', year:2026, price:33500, power:170, fuel:'nafta', cat:'autos', condition:'Nuevo', torque:'200 Nm', accel:'8,8 s', cc:'2.0 L', caja:'CVT', traccion:'Delantera', tanque:'50 L', consumo:'13,8 km/L', largo:'4.630 mm', baul:'470 L' },
  { id:'vw-amarok-v6', brand:'Volkswagen', model:'Amarok', trim:'V6 Highline 3.0 TDI', year:2026, price:58000, power:258, fuel:'diesel', cat:'pickups', condition:'Nuevo', torque:'580 Nm', accel:'7,9 s', cc:'3.0 L', caja:'Automática 8v', traccion:'4x4', tanque:'80 L', consumo:'11,2 km/L', largo:'5.350 mm', baul:'1.050 kg' },
  { id:'toyota-hilux-srx', brand:'Toyota', model:'Hilux', trim:'SRX 2.8 TDI 4x4', year:2026, price:54500, power:204, fuel:'diesel', cat:'pickups', condition:'Nuevo', torque:'500 Nm', accel:'10,7 s', cc:'2.8 L', caja:'Automática 6v', traccion:'4x4', tanque:'80 L', consumo:'12,1 km/L', largo:'5.325 mm', baul:'1.000 kg' },
  { id:'byd-dolphin', brand:'BYD', model:'Dolphin', trim:'GL 44 kWh', year:2026, price:28900, power:95, fuel:'electrico', cat:'autos', condition:'Nuevo', torque:'180 Nm', accel:'12,3 s', cc:'44,9 kWh', caja:'Automática', traccion:'Delantera', tanque:'44,9 kWh', consumo:'340 km', largo:'4.290 mm', baul:'345 L' },
  { id:'chery-tiggo4', brand:'Chery', model:'Tiggo 4 Pro', trim:'Comfort 1.5 CVT', year:2026, price:24990, power:113, fuel:'nafta', cat:'suvs', condition:'Nuevo', torque:'138 Nm', accel:'11,8 s', cc:'1.5 L', caja:'CVT', traccion:'Delantera', tanque:'51 L', consumo:'13,0 km/L', largo:'4.318 mm', baul:'340 L' },
  { id:'renault-kwid', brand:'Renault', model:'Kwid', trim:'Iconic 1.0 SCe', year:2026, price:15500, power:66, fuel:'nafta', cat:'autos', condition:'Nuevo', torque:'93 Nm', accel:'14,9 s', cc:'1.0 L', caja:'Manual 5v', traccion:'Delantera', tanque:'38 L', consumo:'18,9 km/L', largo:'3.731 mm', baul:'290 L' },
  { id:'yamaha-mt03', brand:'Yamaha', model:'MT-03', trim:'321 cc ABS', year:2026, price:8900, power:42, fuel:'nafta', cat:'motos', condition:'Nuevo', torque:'30 Nm', accel:'—', cc:'321 cc', caja:'Manual 6v', traccion:'Cadena', tanque:'14 L', consumo:'27,0 km/L', largo:'2.090 mm', baul:'—' },
];

const CATEGORIES = [
  { id:'all', label:'Todos', icon:'layout-grid', count:1150 },
  { id:'autos', label:'Autos', icon:'car-front', count:304 },
  { id:'suvs', label:'SUVs', icon:'caravan', count:566 },
  { id:'pickups', label:'Camionetas', icon:'truck', count:185 },
  { id:'motos', label:'Motos', icon:'bike', count:91 },
];

const POSTS = [
  { id:'mercosur', tag:'Mercosur', date:'2 may 2026', title:'Acuerdo Mercosur–UE y el sector automotor uruguayo', excerpt:'Qué cambia para autos, motos y repuestos con la baja gradual de aranceles, y en qué plazos.' },
  { id:'impuestos', tag:'Impuestos', date:'17 abr 2026', title:'Impuestos en autos en Uruguay: por qué pagás el doble (y a veces más)', excerpt:'IMESI, IVA y aranceles: cómo se compone el precio final y por qué un 0 km cuesta lo que cuesta.' },
  { id:'200cc', tag:'Motos', date:'16 abr 2026', title:'La barrera de los 200cc: por qué tantos motociclistas arrancan sin libreta', excerpt:'La normativa, los límites de cilindrada y el camino correcto para circular en regla.' },
];

const fmtPrice = (n) => 'USD ' + Number(n).toLocaleString('es-UY');

window.TMK = { VEHICLES, CATEGORIES, POSTS, fmtPrice };
