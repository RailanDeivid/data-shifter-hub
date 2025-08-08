import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Download, RefreshCw, CheckCircle2 } from "lucide-react";

interface ConversionPanelProps {
  selectedFile: File | null;
  targetFormat: string;
  onFormatChange: (format: string) => void;
  onConvert: () => void;
}

export const ConversionPanel = ({ 
  selectedFile, 
  targetFormat, 
  onFormatChange, 
  onConvert 
}: ConversionPanelProps) => {
  const [isConverting, setIsConverting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);

  const getSourceFormat = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'xlsx':
      case 'xls':
      case 'xlsb':
        return 'Excel';
      case 'csv':
        return 'CSV';
      case 'parquet':
        return 'Parquet';
      default:
        return 'Unknown';
    }
  };

  const generateConvertedFile = (originalFile: File, targetFormat: string) => {
    const baseName = originalFile.name.split('.')[0];
    let content = '';
    let mimeType = '';
    let extension = '';

    switch (targetFormat) {
      case 'csv':
        content = 'Nome,Idade,Cidade\nJoão,30,São Paulo\nMaria,25,Rio de Janeiro\nPedro,35,Belo Horizonte';
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      case 'excel':
        // Simula um arquivo Excel básico
        content = 'Nome\tIdade\tCidade\nJoão\t30\tSão Paulo\nMaria\t25\tRio de Janeiro\nPedro\t35\tBelo Horizonte';
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        extension = 'xlsx';
        break;
      case 'parquet':
        // Simula dados para Parquet
        content = 'Dados convertidos para formato Parquet (arquivo simulado)';
        mimeType = 'application/octet-stream';
        extension = 'parquet';
        break;
      default:
        content = 'Arquivo convertido';
        mimeType = 'text/plain';
        extension = 'txt';
    }

    const blob = new Blob([content], { type: mimeType });
    return {
      blob,
      filename: `${baseName}_convertido.${extension}`
    };
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    
    setIsConverting(true);
    setProgress(0);
    setConvertedFileUrl(null);
    
    // Simulate conversion progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsConverting(false);
          setIsComplete(true);
          
          // Generate converted file when conversion is complete
          const { blob, filename } = generateConvertedFile(selectedFile, targetFormat);
          const url = URL.createObjectURL(blob);
          setConvertedFileUrl(url);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    
    onConvert();
  };

  const handleDownload = () => {
    if (!convertedFileUrl || !selectedFile) return;
    
    const { filename } = generateConvertedFile(selectedFile, targetFormat);
    const link = document.createElement('a');
    link.href = convertedFileUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formats = [
    { id: 'csv', name: 'CSV', desc: 'Comma Separated Values' },
    { id: 'parquet', name: 'Parquet', desc: 'Columnar Storage Format' },
    { id: 'excel', name: 'Excel', desc: 'Microsoft Excel Format' }
  ];

  if (!selectedFile) {
    return (
      <Card className="p-6 bg-muted/30">
        <div className="text-center text-muted-foreground">
          <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Selecione um arquivo para começar a conversão</p>
        </div>
      </Card>
    );
  }

  const sourceFormat = getSourceFormat(selectedFile.name);

  return (
    <Card className="p-6 bg-card shadow-card">
      <div className="space-y-6">
        {/* Conversion Flow */}
        <div className="flex items-center justify-center gap-4">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            {sourceFormat}
          </Badge>
          <ArrowRight className="h-5 w-5 text-muted-foreground animate-pulse-slow" />
          <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-primary text-primary">
            {formats.find(f => f.id === targetFormat)?.name || 'Selecione'}
          </Badge>
        </div>

        {/* Format Selection */}
        <div>
          <h3 className="font-semibold mb-3 text-card-foreground">
            Escolha o formato de saída:
          </h3>
          <div className="grid gap-3">
            {formats
              .filter(format => format.name !== sourceFormat)
              .map((format) => (
                <label
                  key={format.id}
                  className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:bg-accent group"
                >
                  <input
                    type="radio"
                    name="format"
                    value={format.id}
                    checked={targetFormat === format.id}
                    onChange={(e) => onFormatChange(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    targetFormat === format.id 
                      ? 'border-primary bg-primary' 
                      : 'border-muted-foreground group-hover:border-primary'
                  }`}>
                    {targetFormat === format.id && (
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-card-foreground">{format.name}</div>
                    <div className="text-sm text-muted-foreground">{format.desc}</div>
                  </div>
                </label>
              ))}
          </div>
        </div>

        {/* Progress or Convert Button */}
        {isConverting ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Convertendo arquivo...</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : isComplete ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Conversão concluída!</span>
            </div>
            <Button 
              onClick={handleDownload}
              className="w-full bg-gradient-primary hover:shadow-elegant transition-all" 
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar arquivo convertido
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleConvert}
            disabled={!targetFormat}
            className="w-full bg-gradient-primary hover:shadow-elegant transition-all" 
            size="lg"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Converter Arquivo
          </Button>
        )}
      </div>
    </Card>
  );
};