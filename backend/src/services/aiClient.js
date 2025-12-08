// backend/src/services/aiClient.js
// Geração REAL de artigos com IA (HuggingFace) + imagem de capa coerente

import dotenv from "dotenv";

dotenv.config();

const HF_MODEL = process.env.HF_MODEL || "";
const HF_API_KEY =
    process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY || "";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || "";

// -----------------------------------------------------------------------------
// Helpers: chamada à HuggingFace Inference API (texto)
// -----------------------------------------------------------------------------

async function callHuggingFaceTextGeneration(prompt) {
    if (!HF_MODEL || !HF_API_KEY) {
        console.warn(
            "[aiClient] HF_MODEL ou HF_API_KEY não configurados. Caindo em fallback local.",
        );
        return null;
    }

    // Exemplo de HF_MODEL: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"
    // No Router, usamos a API OpenAI-compatible em:
    //   POST https://router.huggingface.co/v1/chat/completions
    // e passamos o modelo no campo "model" do body.

    const url = "https://router.huggingface.co/v1/chat/completions";

    const body = {
        model: HF_MODEL, // aqui vai "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"
        messages: [
            {
                role: "system",
                content:
                    "Você é um redator especialista em Pokémon, escrevendo artigos em português do Brasil, com texto natural, fluido e sem mencionar que é uma IA.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        max_tokens: 1800,
        temperature: 0.8,
        top_p: 0.9,
        stream: false,
    };

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const txt = await res.text();
            console.error(
                "[aiClient] Erro HF Router:",
                res.status,
                res.statusText,
                txt,
            );
            return null;
        }

        const data = await res.json();

        // OpenAI-style response: { choices: [ { message: { content: "..." } } ] }
        const content =
            data?.choices?.[0]?.message?.content ||
            data?.choices?.[0]?.delta?.content ||
            null;

        if (!content) {
            console.error("[aiClient] Resposta HF Router sem content:", data);
            return null;
        }

        return content;
    } catch (err) {
        console.error("[aiClient] Exceção ao chamar HF Router:", err);
        return null;
    }
}


// -----------------------------------------------------------------------------
// Helpers: imagem de capa (Unsplash + fallback local)
// -----------------------------------------------------------------------------

function buildImageSearchQuery(topic, category, generation) {
    const baseTopic = topic?.trim() || "pokemon";
    const cat = category || "noticias";

    if (cat === "noticias") return `pokemon news ${baseTopic}`;
    if (cat === "guias") return `pokemon guide tips ${baseTopic}`;
    if (cat === "detonados") return `pokemon game walkthrough ${baseTopic}`;
    if (cat === "torneios") return `pokemon tournament stadium`;
    if (cat === "curiosidades") return `pokemon creatures artwork ${baseTopic}`;
    if (cat === "estrategias") return `pokemon battle strategy ${baseTopic}`;

    return `pokemon game ${baseTopic}`;
}

async function fetchCoverImageFromWeb(query) {
    if (!UNSPLASH_ACCESS_KEY) return null;

    try {
        const url = new URL("https://api.unsplash.com/search/photos");
        url.searchParams.set("query", query);
        url.searchParams.set("per_page", "10");
        url.searchParams.set("orientation", "landscape");

        const res = await fetch(url.toString(), {
            headers: {
                Accept: "application/json",
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
        });

        if (!res.ok) {
            console.error(
                "[aiClient] Falha na busca de imagem Unsplash:",
                res.status,
            );
            return null;
        }

        const data = await res.json();
        if (!data.results || data.results.length === 0) return null;

        const idx = Math.floor(Math.random() * data.results.length);
        const img = data.results[idx];

        return img.urls?.regular || img.urls?.small || null;
    } catch (err) {
        console.error("[aiClient] Erro ao buscar imagem na web:", err);
        return null;
    }
}

const FALLBACK_IMAGES = [
    "/assets/covers/generic-1.jpg",
    "/assets/covers/generic-2.jpg",
    "/assets/covers/generic-3.jpg",
];

function pickFallbackImage() {
    const idx = Math.floor(Math.random() * FALLBACK_IMAGES.length);
    return FALLBACK_IMAGES[idx];
}

// -----------------------------------------------------------------------------
// Helpers: tags e parsing de artigo
// -----------------------------------------------------------------------------

function buildTags(topic, extra = []) {
    const base = ["pokemon", "my-worlds-pokemon"];
    if (!topic) return [...base, ...extra];

    const words = topic
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .split(/\s+/)
        .filter((w) => w.length > 3)
        .slice(0, 4);

    return Array.from(new Set([...base, ...words, ...extra]));
}

// Geração de título dinâmico usado no prompt (mas IA pode mudar)
function generateDynamicTitle(topic, category) {
    const t = topic || "Pokémon";
    const c = category || "noticias";

    const patterns = {
        noticias: [
            `Novidades importantes sobre ${t}`,
            `O que mudou recentemente em ${t}`,
            `Atualizações recentes no universo de ${t}`,
            `O cenário atual de ${t}`,
        ],
        guias: [
            `Como dominar ${t}`,
            `Entendendo na prática ${t}`,
            `Tudo o que você precisa saber sobre ${t}`,
            `Um guia direto e prático sobre ${t}`,
        ],
        detonados: [
            `Detonado completo: ${t}`,
            `Passo a passo para avançar em ${t}`,
            `Como concluir ${t} com mais facilidade`,
            `Caminho eficiente para zerar ${t}`,
        ],
        torneios: [
            `Como se preparar para torneios de ${t}`,
            `Estratégias para competir bem em ${t}`,
            `O que considerar antes de entrar em torneios de ${t}`,
            `Checklist para torneios focados em ${t}`,
        ],
        curiosidades: [
            `Curiosidades e detalhes pouco conhecidos sobre ${t}`,
            `Fatos interessantes envolvendo ${t}`,
            `Coisas que você talvez não saiba sobre ${t}`,
            `Explorando o lado curioso de ${t}`,
        ],
        estrategias: [
            `Estratégias avançadas usando ${t}`,
            `Como evoluir seu jogo com ${t}`,
            `Pensando de forma estratégica com ${t}`,
            `Decisões táticas envolvendo ${t}`,
        ],
    };

    const list = patterns[c] || patterns.guias;
    const idx = Math.floor(Math.random() * list.length);
    return list[idx];
}

// Parser simples: tenta extrair título e excerpt do texto retornado pela IA
function parseGeneratedArticle(rawText) {
    if (!rawText || typeof rawText !== "string") {
        return {
            title: "Artigo sobre Pokémon",
            excerpt: "Um artigo gerado automaticamente sobre o universo Pokémon.",
            content: rawText || "",
        };
    }

    // 1) Remove blocos de raciocínio <think>...</think>
    const cleaned = stripThinkBlocks(rawText);

    const lines = cleaned.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) {
        return {
            title: "Artigo sobre o universo Pokémon",
            excerpt: "Um artigo em português sobre o universo Pokémon.",
            content: "",
        };
    }

    let title = "";
    let excerpt = "";
    let content = cleaned.trim();

    // 2) Tentar achar título em linha começando com "#"
    for (const line of lines) {
        if (line.startsWith("#")) {
            title = line.replace(/^#+\s*/, "").trim();
            break;
        }
    }

    // 3) Se não tem heading, usar a primeira linha como título
    if (!title) {
        title = lines[0];
        // Garante que o conteúdo tenha um heading no topo
        content = `# ${title}\n\n` + lines.slice(1).join("\n");
    }

    // 4) Excerpt = primeira linha não-vazia depois do título, que não seja outro heading
    const titleIndex = lines.findIndex((l) =>
        l.replace(/^#+\s*/, "").trim() === title,
    );

    if (titleIndex >= 0) {
        for (let i = titleIndex + 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line) continue;
            if (line.startsWith("#")) continue;
            excerpt = line;
            break;
        }
    }

    if (!excerpt) {
        excerpt =
            "Um artigo em português sobre o universo Pokémon, gerado automaticamente por IA.";
    }

    return {
        title,
        excerpt,
        content,
    };
}


function stripThinkBlocks(text) {
    if (!text || typeof text !== "string") return text;
    // Remove qualquer bloco <think>...</think>, incluindo quebras de linha
    return text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

function ensureConclusion(markdown, topic) {
    if (!markdown || typeof markdown !== "string") return markdown;

    const lower = markdown.toLowerCase();

    // Se já tiver uma seção de conclusão, não mexe
    if (lower.includes("## conclusão") || lower.includes("## conclusao")) {
        return markdown;
    }

    const trimmed = markdown.trim();

    const conclusion = `
## Conclusão

${topic} é um tema muito importante dentro do universo Pokémon, e entender seus detalhes na prática faz toda a diferença na hora de batalhar. Use as ideias e recomendações deste artigo como ponto de partida, faça testes, ajuste seus times e, principalmente, mantenha a curiosidade de aprender um pouco mais a cada partida.

Boa sorte nas próximas batalhas e continue evoluindo como treinador!
`.trim();

    // Garante uma linha em branco antes da conclusão
    return `${trimmed}\n\n${conclusion}\n`;
}


// -----------------------------------------------------------------------------
// GERAÇÃO REAL DE ARTIGO (POST) COM IA
// -----------------------------------------------------------------------------
async function generatePost({ topic, category, generation }) {
    const safeTopic = topic?.trim() || "Estratégias em Pokémon";
    const safeCategory = category || "noticias";
    const safeGen = generation || "geral";

    // Título sugerido para orientar a IA (ela pode adaptar/mudar)
    const suggestedTitle = generateDynamicTitle(safeTopic, safeCategory);

    const genLabel =
        safeGen === "geral"
            ? "todas as gerações de Pokémon"
            : `a geração ${safeGen.toUpperCase()}`;

    const prompt = `
Você é um redator especialista em Pokémon escrevendo em português do Brasil.

Escreva UM ARTIGO COMPLETO em formato Markdown sobre o seguinte tema:

- Tema principal: "${safeTopic}"
- Categoria de conteúdo: "${safeCategory}" (valores possíveis: noticias, guias, detonados, torneios, curiosidades, estrategias)
- Contexto: universo de Pokémon, focado em jogadores iniciantes e intermediários.
- Geração alvo: ${genLabel}

Requisitos de saída:
- Escreva um título forte e natural na primeira linha, usando Markdown (por exemplo: "# Título do Artigo") em português.
- Logo após o título, escreva UM parágrafo curto (2–3 frases) que sirva de resumo/introdução do artigo.
- Em seguida, desenvolva o conteúdo em seções com headings "##", "###" quando fizer sentido.
- Inclua, obrigatoriamente, uma seção final chamada exatamente "## Conclusão", com 1–3 parágrafos fechando as ideias do texto.
- Traga exemplos, explicações práticas e, quando fizer sentido, dicas aplicáveis na jogabilidade.
- O texto deve ter um tamanho razoável (entre 700 e 1200 palavras), ser original, fluido e natural, evitando repetição mecânica.
- Não mencione que o texto foi gerado por IA.
- NÃO inclua nenhum raciocínio passo a passo, nem use tags <think>. Responda apenas com o artigo final em Markdown.

Saída APENAS em texto Markdown, sem JSON, sem código, sem comentários.
Sugestão de título para inspiração (não obrigatório copiar): "${suggestedTitle}"
`.trim();

    // Chama HF
    const raw = await callHuggingFaceTextGeneration(prompt);

    let parsed;

    // Se HF falhar, não vamos quebrar o fluxo – usamos um fallback mínimo
    if (!raw) {
        const fallbackContent = `
# ${suggestedTitle}

Não foi possível contatar o modelo de IA no momento. Este é um artigo gerado a partir de conteúdo padrão de fallback.

${safeTopic} é um tema importante no universo Pokémon. Explore diferentes gerações, teste estratégias e ajuste seus times conforme seu estilo de jogo.

## Conclusão

Mesmo com um conteúdo mais simples, entender os fundamentos de ${safeTopic.toLowerCase()} já ajuda bastante na hora de montar seus times e enfrentar desafios dentro dos jogos de Pokémon. A partir daqui, você pode aprofundar mais, testar variações e adaptar tudo ao seu estilo de jogo.
`.trim();

        parsed = parseGeneratedArticle(fallbackContent);
    } else {
        parsed = parseGeneratedArticle(raw);
    }

    // Garante que o conteúdo tenha uma conclusão, mesmo se o modelo truncar
    const finalContent = ensureConclusion(parsed.content, safeTopic);

    const imageQuery = buildImageSearchQuery(safeTopic, safeCategory, safeGen);
    const coverFromWeb = await fetchCoverImageFromWeb(imageQuery);
    const cover_image = coverFromWeb || pickFallbackImage();

    return {
        title: parsed.title,
        excerpt: parsed.excerpt,
        content: finalContent,
        tags: buildTags(safeTopic, [safeCategory, safeGen]),
        meta_description: `Artigo sobre ${safeTopic} no universo Pokémon, com foco em ${safeCategory}.`,
        category: safeCategory,
        generation: safeGen,
        cover_image,
    };
}


// -----------------------------------------------------------------------------
// GERAÇÃO DE GUIA – ainda local (pode ser evoluído depois com IA também)
// -----------------------------------------------------------------------------
async function generateGuide({ topic, generation }) {
    const safeTopic = topic?.trim() || "Detonado básico";
    const safeGen = generation || "geral";

    const title = `Guia prático: ${safeTopic}`;
    const game =
        safeGen === "geral"
            ? "Diversos jogos Pokémon"
            : `Jogos da geração ${safeGen.toUpperCase()}`;

    const description = `Um guia em português focado em ${safeTopic}, pensado para jogadores de ${game}.`;

    const chapters = [
        {
            number: 1,
            title: "Introdução ao tema",
            content: `
# Introdução

Neste guia vamos explorar **${safeTopic}** no contexto de Pokémon. A ideia é apresentar conceitos de forma clara, para que tanto iniciantes quanto jogadores experientes possam aproveitar.
      `.trim(),
        },
        {
            number: 2,
            title: "Conceitos fundamentais",
            content: `
# Conceitos fundamentais

Antes de colocar a mão na massa, é importante entender alguns pilares que envolvem ${safeTopic.toLowerCase()} no universo Pokémon.
      `.trim(),
        },
        {
            number: 3,
            title: "Aplicando na prática",
            content: `
# Aplicando na prática

Aqui estão algumas ideias para levar **${safeTopic.toLowerCase()}** para o jogo real e adaptar às suas necessidades.
      `.trim(),
        },
    ];

    const imageQuery = buildImageSearchQuery(safeTopic, "guias", safeGen);
    const coverFromWeb = await fetchCoverImageFromWeb(imageQuery);
    const cover_image = coverFromWeb || pickFallbackImage();

    return {
        title,
        game,
        description,
        chapters,
        generation: safeGen,
        cover_image,
    };
}

// -----------------------------------------------------------------------------
// GERAÇÃO DE TORNEIO – local (pode ser IA depois, se quiser)
// -----------------------------------------------------------------------------
async function generateTournament({ topic, generation, format }) {
    const safeTopic = topic?.trim() || "Torneio Pokémon My World";
    const safeGen = generation || "geral";
    const safeFormat = format || "singles";

    const name = safeTopic;

    const description = `
O **${safeTopic}** é um torneio voltado para jogadores que querem testar suas habilidades em batalhas Pokémon em um ambiente amistoso, mas competitivo.
`.trim();

    const rules = `
# Regras do torneio – ${safeTopic}

- Formato de batalha: **${safeFormat.toUpperCase()}**
- Geração alvo: ${safeGen === "geral" ? "todas as gerações" : safeGen.toUpperCase()}
- Ajuste as regras conforme o público-alvo e o nível de competitividade desejado.
`.trim();

    const imageQuery = buildImageSearchQuery(safeTopic, "torneios", safeGen);
    const coverFromWeb = await fetchCoverImageFromWeb(imageQuery);
    const cover_image = coverFromWeb || pickFallbackImage();

    return {
        name,
        description,
        rules,
        generation: safeGen,
        cover_image,
    };
}

// -----------------------------------------------------------------------------
// Função principal usada pela rota /ai/generate
// -----------------------------------------------------------------------------
export async function generateContentWithAI({
    type,
    topic,
    category,
    generation,
    format,
}) {
    const safeType = type || "post";

    if (safeType === "guide") {
        return generateGuide({ topic, generation });
    }

    if (safeType === "tournament") {
        return generateTournament({ topic, generation, format });
    }

    // default: post/artigo REAL gerado por IA
    return generatePost({ topic, category, generation });
}
