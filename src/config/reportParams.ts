/**
 * Parametrii specifici evaluării AERISK-ASSESS-2026-0452
 * Livada Ion Moraru, 2.4 ha — Măr, Înflorire, Codrii, Moldova
 *
 * Acești parametri sunt partajați între componente pentru consistența
 * datelor în tot raportul. Modificarea lor actualizează toate paginile.
 */

export const REPORT_PARAMS = {
  // Monte Carlo — parametrii hazard + vulnerabilitate
  hazardProbability: 0.20,    // 20% probabilitate anuală calibrată frost
  lossRatioMin:     0.05,     // Distribuție triangulară — minim
  lossRatioMode:    0.20,     // Distribuție triangulară — valoare modală
  lossRatioMax:     0.50,     // Distribuție triangulară — maxim
  exposureValue:    10_000,   // Valoare expusă asigurată (EUR)

  // Evenimentul specific documentat în raport
  temperatureCelsius: -2.5,   // Temperatura minimă înregistrată (°C)
  crop:               'apple' as const,
  phenophase:         'flowering' as const,
} as const;

/** URL-ul backend-ului — configurabil prin variabilă de mediu Vite */
export const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:8000';
