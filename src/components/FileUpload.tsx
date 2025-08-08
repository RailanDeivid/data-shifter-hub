import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFormats: string[];
  selectedFile: File | null;
  onRemoveFile: () => void;
}

export const FileUpload = ({ 
  onFileSelect, 
  acceptedFormats, 
  selectedFile, 
  onRemoveFile 
}: FileUploadProps) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
    setIsDragActive(false);
  }, [onFileSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/octet-stream': ['.parquet']
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false)
  });

  if (selectedFile) {
    return (
      <Card className="p-6 bg-card shadow-card border-success/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <File className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="font-medium text-card-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRemoveFile}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      {...getRootProps()}
      className={cn(
        "p-8 border-2 border-dashed transition-all duration-300 cursor-pointer group",
        "bg-upload hover:bg-upload-hover",
        isDragActive 
          ? "border-primary bg-upload-hover scale-105" 
          : "border-upload-border hover:border-primary/50"
      )}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-primary rounded-full group-hover:animate-float">
            <Upload className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-card-foreground mb-2">
          {isDragActive ? "Solte o arquivo aqui" : "Arraste e solte seu arquivo"}
        </h3>
        <p className="text-muted-foreground mb-4">
          ou <span className="text-primary font-medium">clique para selecionar</span>
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
          {acceptedFormats.map((format) => (
            <span 
              key={format} 
              className="px-2 py-1 bg-secondary rounded-md font-medium"
            >
              {format}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};