export enum AppState {
  INITIALIZING,
  IDLE,
  ANALYZING,
  RESULT,
  ERROR,
}

export interface AnalysisDetail {
  nivel: 'Baixo' | 'Médio' | 'Alto' | 'Normal' | 'N/A';
  descricao: string;
}

export interface AnalysisData {
  turbidez: AnalysisDetail;
  algas: AnalysisDetail;
  cor: AnalysisDetail;
  residuos: AnalysisDetail;
  sumario: string;
}