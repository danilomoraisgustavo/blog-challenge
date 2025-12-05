import React, { useState } from "react";
import { api } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AIGeneratorButton({ type = "post", onGenerated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");
  const [generation, setGeneration] = useState("geral");
  const [format, setFormat] = useState("");

  async function handleGenerate() {
    if (!topic.trim()) return;

    setLoading(true);

    try {
      // Montamos o payload e mandamos tudo para o backend
      const payload = {
        type,           // "post" | "guide" | "tournament"
        topic,          // tema pedido pelo usuário
        category: category || null,
        generation,     // gen1...gen9 ou "geral"
        format: type === "tournament" ? format || "singles" : null,
      };

      // Chama seu backend (que usará uma LLM gratuita – ex.: HuggingFace)
      const result = await api.generateContentWithAI(payload);
      // Esperado:
      // type === "post":
      //   { title, excerpt, content, tags, meta_description, category?, generation? }
      // type === "guide":
      //   { title, game, description, chapters: [...] }
      // type === "tournament":
      //   { name, description, rules }

      if (onGenerated && result) {
        onGenerated({
          ...result,
          // garantimos que category/generation/format venham preenchidos
          category: result.category || category || "noticias",
          generation: result.generation || generation,
          format: result.format || (type === "tournament" ? format || "singles" : undefined),
        });
      }

      setOpen(false);
      setTopic("");
    } catch (error) {
      console.error("Erro ao gerar conteúdo com IA:", error);
      alert("Erro ao gerar conteúdo com IA. Verifique o backend / serviço de IA.");
    } finally {
      setLoading(false);
    }
  }

  const getTitle = () => {
    switch (type) {
      case "post":
        return "Gerar Post com IA";
      case "guide":
        return "Gerar Guia com IA";
      case "tournament":
        return "Gerar Descrição/Regras com IA";
      default:
        return "Gerar com IA";
    }
  };

  const getPlaceholder = () => {
    if (type === "post") {
      return "Ex: Novidades sobre Pokémon Legends Z-A, melhores estratégias para VGC 2025...";
    }
    if (type === "guide") {
      return "Ex: Detonado completo de Pokémon Emerald, guia de EVs para iniciantes...";
    }
    if (type === "tournament") {
      return "Ex: Torneio VGC Regulation G, Campeonato Smogon OU...";
    }
    return "Descreva o conteúdo que deseja gerar...";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Gerar com IA
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-slate-900 border-white/10 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-sm text-white/50">
            A IA gera um rascunho de conteúdo com base no tema escolhido. Você poderá revisar e editar antes de salvar.
          </DialogDescription>
          
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label>Sobre o que você quer gerar?</Label>
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={getPlaceholder()}
              className="bg-white/5 border-white/10 text-white mt-1"
              rows={3}
            />
          </div>

          {type === "post" && (
            <div>
              <Label>Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="noticias" className="text-white">
                    Notícias
                  </SelectItem>
                  <SelectItem value="guias" className="text-white">
                    Guias
                  </SelectItem>
                  <SelectItem value="estrategias" className="text-white">
                    Estratégias
                  </SelectItem>
                  <SelectItem value="curiosidades" className="text-white">
                    Curiosidades
                  </SelectItem>
                  <SelectItem value="torneios" className="text-white">
                    Torneios
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {type === "tournament" && (
            <div>
              <Label>Formato</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="singles" className="text-white">
                    Singles
                  </SelectItem>
                  <SelectItem value="doubles" className="text-white">
                    Doubles
                  </SelectItem>
                  <SelectItem value="vgc" className="text-white">
                    VGC
                  </SelectItem>
                  <SelectItem value="smogon_ou" className="text-white">
                    Smogon OU
                  </SelectItem>
                  <SelectItem value="smogon_uu" className="text-white">
                    Smogon UU
                  </SelectItem>
                  <SelectItem value="random_battle" className="text-white">
                    Random Battle
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Geração Relacionada</Label>
            <Select value={generation} onValueChange={setGeneration}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="geral" className="text-white">
                  Geral
                </SelectItem>
                <SelectItem value="gen1" className="text-white">
                  Geração I
                </SelectItem>
                <SelectItem value="gen2" className="text-white">
                  Geração II
                </SelectItem>
                <SelectItem value="gen3" className="text-white">
                  Geração III
                </SelectItem>
                <SelectItem value="gen4" className="text-white">
                  Geração IV
                </SelectItem>
                <SelectItem value="gen5" className="text-white">
                  Geração V
                </SelectItem>
                <SelectItem value="gen6" className="text-white">
                  Geração VI
                </SelectItem>
                <SelectItem value="gen7" className="text-white">
                  Geração VII
                </SelectItem>
                <SelectItem value="gen8" className="text-white">
                  Geração VIII
                </SelectItem>
                <SelectItem value="gen9" className="text-white">
                  Geração IX
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando conteúdo...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar Conteúdo
              </>
            )}
          </Button>

          <p className="text-white/40 text-xs text-center">
            A IA irá gerar conteúdo baseado no tema. Você poderá revisar e editar antes de salvar.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
