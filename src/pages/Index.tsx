import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ConversionPanel } from "@/components/ConversionPanel";
import { Card } from "@/components/ui/card";
import { FileText, ArrowUpDown, Zap } from "lucide-react";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>("");

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setTargetFormat(""); // Reset format selection when new file is selected
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setTargetFormat("");
  };

  const handleConvert = () => {
    // Here you would implement the actual conversion logic
    console.log(`Converting ${selectedFile?.name} to ${targetFormat}`);
  };

  const acceptedFormats = ["XLSX", "XLS", "XLSB", "CSV", "PARQUET"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-full">
                <ArrowUpDown className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Conversor de Arquivos
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Converta facilmente entre Excel, CSV e Parquet
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <FileText className="h-4 w-4" />
                <span>Excel ↔ CSV</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Zap className="h-4 w-4" />
                <span>CSV ↔ Parquet</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <ArrowUpDown className="h-4 w-4" />
                <span>Excel ↔ Parquet</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* File Upload Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  1. Selecione seu arquivo
                </h2>
                <p className="text-muted-foreground">
                  Arraste e solte ou clique para selecionar arquivos Excel, CSV ou Parquet
                </p>
              </div>
              
              <FileUpload
                onFileSelect={handleFileSelect}
                acceptedFormats={acceptedFormats}
                selectedFile={selectedFile}
                onRemoveFile={handleRemoveFile}
              />
            </div>

            {/* Conversion Panel */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  2. Configure a conversão
                </h2>
                <p className="text-muted-foreground">
                  Escolha o formato de saída e inicie a conversão
                </p>
              </div>

              <ConversionPanel
                selectedFile={selectedFile}
                targetFormat={targetFormat}
                onFormatChange={setTargetFormat}
                onConvert={handleConvert}
              />
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center text-foreground mb-8">
              Por que usar nosso conversor?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center bg-card shadow-card">
                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-card-foreground mb-2">Rápido e Eficiente</h4>
                <p className="text-muted-foreground text-sm">
                  Conversões otimizadas que preservam a integridade dos seus dados
                </p>
              </Card>

              <Card className="p-6 text-center bg-card shadow-card">
                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-card-foreground mb-2">Múltiplos Formatos</h4>
                <p className="text-muted-foreground text-sm">
                  Suporte completo para Excel (.xlsx, .xls, .xlsb), CSV e Parquet
                </p>
              </Card>

              <Card className="p-6 text-center bg-card shadow-card">
                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <ArrowUpDown className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-card-foreground mb-2">Fácil de Usar</h4>
                <p className="text-muted-foreground text-sm">
                  Interface intuitiva com drag-and-drop para máxima facilidade
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;