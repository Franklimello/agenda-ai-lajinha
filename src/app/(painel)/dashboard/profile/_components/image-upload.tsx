"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import userImg from "../../../../../../public/foto1.png";

interface ImageUploadProps {
  currentImage?: string | null;
  onImageChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({
  currentImage,
  onImageChange,
  disabled = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Atualizar preview quando currentImage mudar externamente
  useEffect(() => {
    setPreview(currentImage || null);
  }, [currentImage]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Formato inválido", {
        description: "Por favor, selecione uma imagem JPG, PNG ou WEBP.",
      });
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande", {
        description: "A imagem deve ter no máximo 5MB.",
      });
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Fazer upload
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/profile-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setPreview(data.url);
        onImageChange(data.url);
        toast.success("Imagem enviada com sucesso!");
      } else {
        toast.error("Erro ao fazer upload", {
          description: data.error || "Não foi possível fazer upload da imagem. Tente novamente.",
        });
        setPreview(currentImage || null);
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao fazer upload", {
        description: "Não foi possível fazer upload da imagem. Tente novamente.",
      });
      setPreview(currentImage || null);
    } finally {
      setIsUploading(false);
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div
          className={cn(
            "relative h-32 w-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100",
            isUploading && "opacity-50"
          )}
        >
          {preview ? (
            <Image
              src={preview.startsWith("/") ? preview : preview}
              alt="Foto de perfil"
              fill
              className="object-cover"
              unoptimized={!preview.startsWith("http")}
            />
          ) : (
            <Image
              src={userImg}
              alt="Foto padrão"
              fill
              className="object-cover"
            />
          )}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
        {preview && !isUploading && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          id="profile-image-upload"
          disabled={disabled || isUploading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Enviando..." : preview ? "Alterar foto" : "Enviar foto"}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          JPG, PNG ou WEBP (máx. 5MB)
        </p>
      </div>
    </div>
  );
}

