/**
 * Parametrii raportului AERISK PRO
 *
 * Prioritate:
 *   1. URL query params (când raportul e deschis din dashboard cu date reale)
 *   2. Valori demo hardcodate (când raportul e deschis direct / standalone)
 */

// ─── Defaults demo ───────────────────────────────────────────────────────────
const DEFAULTS = {
  hazardProbability:  0.20,
  lossRatioMin:       0.05,
  lossRatioMode:      0.20,
  lossRatioMax:       0.50,
  exposureValue:      10_000,
  temperatureCelsius: -2.5,
  crop:               'apple',
  variety:            'Idared',
  phenophase:         'flowering',
  currency:           'EUR',
  region:             'Ștefan Vodă',
  locality:           'Purcari',
  country:            'Moldova',
  areaHa:             2.4,
  analystId:          'AERISK-DEMO',
  hazardType:         'FROST',
  assetType:          'orchard',
  lat:                46.51,
  lon:                29.66,
};

// ─── Parse URL params ─────────────────────────────────────────────────────────
function parseUrl() {
  if (typeof window === 'undefined') return {} as ReturnType<typeof _buildParsed>;
  const p = new URLSearchParams(window.location.search);
  const get = (k: string) => p.get(k);
  const num = (k: string, fallback: number) => {
    const v = get(k); return v !== null && v !== '' ? parseFloat(v) : fallback;
  };
  return _buildParsed(get, num);
}

function _buildParsed(
  get: (k: string) => string | null,
  num: (k: string, fallback: number) => number,
) {
  return {
    // ── Locație ───────────────────────────────────────────────────────────────
    region:            get('region')     ?? DEFAULTS.region,
    locality:          get('locality')   ?? DEFAULTS.locality,
    country:           get('country')    ?? DEFAULTS.country,
    lat:               num('lat',         DEFAULTS.lat),
    lon:               num('lon',         DEFAULTS.lon),

    // ── Activ ─────────────────────────────────────────────────────────────────
    assetType:         get('asset_type') ?? DEFAULTS.assetType,
    crop:              get('crop')       ?? DEFAULTS.crop,
    variety:           get('variety')    ?? DEFAULTS.variety,
    phenophase:        get('phenophase') ?? DEFAULTS.phenophase,
    areaHa:            num('area_ha',     DEFAULTS.areaHa),

    // ── Hazard ────────────────────────────────────────────────────────────────
    hazardType:        get('hazard_type') ?? DEFAULTS.hazardType,
    hazardProbability: num('hazard_prob',  DEFAULTS.hazardProbability),

    // ── Financiar ─────────────────────────────────────────────────────────────
    exposureValue:     num('exposure',         DEFAULTS.exposureValue),
    currency:          get('currency')         ?? DEFAULTS.currency,
    lossRatioMin:      num('loss_ratio_min',   DEFAULTS.lossRatioMin),
    lossRatioMode:     num('loss_ratio_mode',  DEFAULTS.lossRatioMode),
    lossRatioMax:      num('loss_ratio_max',   DEFAULTS.lossRatioMax),

    // ── Risc ──────────────────────────────────────────────────────────────────
    riskScore:         num('risk_score', 0),
    riskLevel:         get('risk_level') ?? '',

    // ── Metrici pre-computate ─────────────────────────────────────────────────
    precomputed: (() => {
      const aal   = get('aal');
      const var90 = get('var90');
      const var95 = get('var95');
      const var99 = get('var99');
      if (!aal || !var95 || !var99) return null;
      return {
        aal:    parseFloat(aal),
        var_90: parseFloat(var90 ?? '0'),
        var_95: parseFloat(var95),
        var_99: parseFloat(var99),
        pml_99: parseFloat(get('pml99') ?? var99),
      };
    })(),

    // ── Context ───────────────────────────────────────────────────────────────
    analystId:    get('analyst_id') ?? DEFAULTS.analystId,
  };
}

const _url = parseUrl();

// ─── Export principal: parametrii pentru apeluri API (EP Curve etc.) ─────────
export const REPORT_PARAMS = {
  hazardProbability:  _url.hazardProbability,
  lossRatioMin:       _url.lossRatioMin,   // ← din engine, nu mai e DEFAULTS
  lossRatioMode:      _url.lossRatioMode,
  lossRatioMax:       _url.lossRatioMax,
  exposureValue:      _url.exposureValue,
  temperatureCelsius: DEFAULTS.temperatureCelsius,
  crop:               _url.crop,
  phenophase:         _url.phenophase,
};

// ─── Metrici pre-computate (dacă vin din dashboard, nu mai re-fetchăm) ────────
export const PRECOMPUTED_METRICS: {
  aal: number; var_90: number; var_95: number; var_99: number; pml_99: number;
} | null = _url.precomputed;

// ─── Date de context complet (pentru toate paginile raportului) ───────────────
export const REPORT_CONTEXT = {
  // Locație
  region:     _url.region,
  locality:   _url.locality,
  country:    _url.country,
  lat:        _url.lat,
  lon:        _url.lon,

  // Activ
  assetType:  _url.assetType,
  crop:       _url.crop,
  variety:    _url.variety,
  phenophase: _url.phenophase,
  areaHa:     _url.areaHa,

  // Hazard
  hazardType:        _url.hazardType,
  hazardProbability: _url.hazardProbability,

  // Financiar
  exposureValue: _url.exposureValue,
  currency:      _url.currency,

  // Risc
  riskScore:  _url.riskScore,
  riskLevel:  _url.riskLevel,

  // Meta
  analystId:  _url.analystId,
  isLiveData: _url.precomputed !== null,
};

/**
 * URL-ul backend-ului.
 * - În browser: folosim path relativ '' → Vite proxy '/api' → aerisk-backend:8000
 * - Override explicit via VITE_API_URL dacă e necesar (ex: staging/prod)
 */
export const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_URL ?? '';
