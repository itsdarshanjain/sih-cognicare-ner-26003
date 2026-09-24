export const recordTelemetry = (gameId, telemetryData) => {
  try {
    const existingStr = localStorage.getItem('cogni_telemetry');
    const existing = existingStr ? JSON.parse(existingStr) : [];
    
    const newEntry = {
      gameId,
      timestamp: new Date().toISOString(),
      ...telemetryData
    };
    
    existing.push(newEntry);
    // Keep last 100 entries to prevent local storage bloat
    if (existing.length > 100) {
      existing.shift();
    }
    
    localStorage.setItem('cogni_telemetry', JSON.stringify(existing));
    return existing;
  } catch (error) {
    console.error("Failed to record telemetry:", error);
    return null;
  }
};

export const getTelemetry = () => {
  try {
    const existingStr = localStorage.getItem('cogni_telemetry');
    return existingStr ? JSON.parse(existingStr) : [];
  } catch (error) {
    return [];
  }
};
