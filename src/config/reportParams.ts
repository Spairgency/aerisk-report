/**
 * Parametrii raportului AERISK PRO
 *
 * Prioritate:
 *   1. URL query params (când raportul e deschis din dashboard cu date reale)
 *   2. Valori demo hardcodate (când raportul e deschis direct / standalone)
 */

// ─── Defaults demo ───────────────────────────────────────────────────────────
const DEFAULTS = {
  hazardProbability: 0.20,
  lossRatioMin:      0.05,
  lossRatioMode:     0.20,
  lossRatioMax:      0.50,
  exposureValue:     10_000,
  temperatureCelsius: -2.5,
  crop:              'apple',
  phenophase:        'flowering',
  currency:          'EUR',
  region:            'Ștefan Vodă',
  locality:          'Purcari',
  country:           'Moldova',
  areaHa:            2.4,
  analystId:         'AERISK-DEMO',
};

// ─── Parse URL params ─────────────────────────────────────────────────────────
function parseUrl() {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search);
  const get = (k: string) => p.get(k);
  const num = (k: string, fallback: number) => {
    const v = get(k); return v !== null && v !== '' ? parseFloat(v) : fallback;
  };

  return {
    // Params pentru EP Curve endpoint
    hazardProbability: num('hazard_prob', DEFAULTS.hazardProbability),
    exposureValue:     num('exposure',    DEFAULTS.exposureValue),
    crop:              get('crop')       ?? DEFAULTS.crop,
    phenophase:        get('phenophase') ?? DEFAULTS.phenophase,
    currency:          get('currency')   ?? DEFAULTS.currency,
    region:            get('region')     ?? DEFAULTS.region,
    locality:          get('locality')   ?? DEFAULTS.locality,
    country:           get('country')    ?? DEFAULTS.country,
    areaHa:            num('area_ha',    DEFAULTS.areaHa),
    analystId:         get('analyst_id') ?? DEFAULTS.analystId,

    // Metrici pre-computate din dashboard (evită re-calcul)
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

    // Risk summary din dashboard
    riskScore: num('risk_score', 0),
    riskLevel: get('risk_level') ?? '',
  };
}

const _url = parseUrl();

// ─── Export principal: parametrii pentru apeluri API ─────────────────────────
export const REPORT_PARAMS = {
  hazardProbability: _url.hazardProbability,
  lossRatioMin:      DEFAULTS.lossRatioMin,
  lossRatioMode:     DEFAULTS.lossRatioMode,
  lossRatioMax:      DEFAULTS.lossRatioMax,
  exposureValue:     _url.exposureValue,
  temperatureCelsius: DEFAULTS.temperatureCelsius,
  crop:              _url.crop,
  phenophase:        _url.phenophase,
};

// ─── Metrici pre-computate (dacă vin din dashboard, nu mai re-fetchăm) ────────
export const PRECOMPUTED_METRICS: {
  aal: number; var_90: number; var_95: number; var_99: number; pml_99: number;
} | null = _url.precomputed;

// ─── Date de context (pentru Page1, header, etc.) ────────────────────────────
export const REPORT_CONTEXT = {
  currency:   _url.currency,
  region:     _url.region,
  locality:   _url.locality,
  country:    _url.country,
  areaHa:     _url.areaHa,
  analystId:  _url.analystId,
  crop:       _url.crop,
  phenophase: _url.phenophase,
  riskScore:  _url.riskScore,
  riskLevel:  _url.riskLevel,
  isLiveData: _url.precomputed !== null,
};

/** URL-ul backend-ului — configurabil prin variabilă de mediu Vite */
export const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:8000';
