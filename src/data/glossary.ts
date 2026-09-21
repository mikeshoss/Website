/**
 * A glossary of the vocabulary that surrounds AI products, written for the
 * person who has just heard the word in a meeting and does not want to ask.
 *
 * Every entry carries two readings. `means` is the straight definition — what
 * the word denotes, stated plainly. `reallyMeans` is what it turns out to mean
 * once you have shipped one, which is usually the part nobody writes down.
 *
 * Adding a term is one object here: it gets its own page, a card on the index,
 * a DefinedTerm entry in the structured data, a sitemap URL, a JSON API entry
 * and a section in llms.txt, with no other file touched.
 */

export type GlossaryCategory =
  | "agents"
  | "context"
  | "evaluation"
  | "governance";

export interface GlossaryTerm {
  /** URL segment for /glossary/<slug>. Stable once shipped — these get indexed. */
  slug: string;
  term: string;
  /**
   * How someone would type it into a search box. Becomes the page title, so it
   * matches the query rather than restating the term.
   */
  question: string;
  /** Other names for the same thing, so a search for any of them lands here. */
  aliases?: string[];
  category: GlossaryCategory;
  /** One sentence. Index card, meta description, and the schema description. */
  short: string;
  /** The straight definition. */
  means: string[];
  /** What it means in practice. */
  reallyMeans: string[];
  /** A concrete test the reader can apply themselves. */
  tell?: string;
  /** Slugs of related terms. */
  related?: string[];
}

export const GLOSSARY_CATEGORIES: Record<GlossaryCategory, string> = {
  agents: "Agents & systems",
  context: "Context & retrieval",
  evaluation: "Evaluation & failure",
  governance: "Governance & oversight",
};

export const glossary: GlossaryTerm[] = [
  {
    slug: "harness",
    term: "Harness",
    question: "What is a harness in AI?",
    aliases: ["Agent harness", "Scaffolding", "Agent loop"],
    category: "agents",
    short:
      "The code around the model that decides what it sees, what it can do, and when it stops.",
    means: [
      "A harness is everything wrapped around a language model to make it a product: the loop that calls it, the context assembled for each call, the tools it is allowed to invoke, the retries, the stopping conditions, and what happens to its output afterwards.",
      "The model itself is a function that turns text into text. The harness is the program that calls that function, repeatedly, with intent.",
    ],
    reallyMeans: [
      "It means the part you are actually building. Teams say “we're using Claude” or “we're on GPT” as though that were the product decision. It rarely is. Two teams on an identical model ship products that differ by an order of magnitude in accuracy, cost and trust, and nearly all of that difference is harness — what got retrieved, how the task was decomposed, which tool calls were permitted, what happened when the model was unsure.",
      "So when someone says the model is not good enough, ask to see the harness first. Most of the time the model was never given what it needed to answer.",
    ],
    tell: "Swap the underlying model and watch what happens. If the product barely changes, the harness is doing the work — usually a good sign. If it collapses, you have been relying on one model's habits rather than building a system.",
    related: ["agent", "context-engineering", "eval"],
  },
  {
    slug: "agent",
    term: "Agent",
    question: "What is an AI agent?",
    aliases: ["AI agent", "Autonomous agent", "Agentic system"],
    category: "agents",
    short:
      "A model in a loop with tools, allowed to take more than one step before it comes back.",
    means: [
      "The word covers a lot of ground, but the load-bearing part is this: the model does not answer once and stop. It can call tools, read the results, and decide what to do next, repeating until some condition is met.",
      "A chatbot answers. An agent acts, checks, and acts again.",
    ],
    reallyMeans: [
      "In practice it usually means “a loop we have not finished specifying.” Autonomy is not the achievement — bounded autonomy is. The engineering is entirely in the bounds: how many steps, which tools, what happens when a tool fails, what it must never touch, and how a person gets back in.",
      "In high-consequence work the interesting question is never whether the agent can do the task unsupervised. It is what the agent does when it is about to be wrong, and who finds out.",
    ],
    tell: "Ask what happens on step seven when a tool returns an error. A real agent has an answer. A demo has a happy path.",
    related: ["harness", "tool-use", "human-in-the-loop"],
  },
  {
    slug: "agentic",
    term: "Agentic",
    question: "What does agentic mean?",
    aliases: ["Agentic AI", "Agentic workflow"],
    category: "agents",
    short:
      "An adjective meaning the system takes multiple steps on its own — and, increasingly, a marketing word meaning very little.",
    means: [
      "Applied honestly, agentic describes software where a model plans and acts over several steps rather than producing a single response: it decides what to do next based on what it just learned.",
      "An agentic workflow is one where that decision-making is genuinely delegated, as opposed to a fixed pipeline that happens to call a model at each stage.",
    ],
    reallyMeans: [
      "It has become the adjective you attach to a roadmap to make it fundable. A great deal of software now described as agentic is a sequence of prompts in a fixed order, which is a pipeline — a perfectly good thing to build, and not the same thing.",
      "The distinction is worth defending, because the two have completely different failure modes. A pipeline fails predictably at a known stage. An agentic system fails in ways you have to go and discover.",
    ],
    tell: "Ask whether the order of operations can change at runtime based on what the system finds. If it cannot, it is a pipeline, and that is fine — call it one.",
    related: ["agent", "harness", "orchestration"],
  },
  {
    slug: "orchestration",
    term: "Orchestration",
    question: "What is AI orchestration?",
    aliases: ["Multi-agent orchestration", "Agent coordination"],
    category: "agents",
    short:
      "Coordinating several models, tools or agents so the right one handles each part of a job.",
    means: [
      "Orchestration is the layer that routes work: decomposing a task, dispatching parts of it to specialised models, tools or sub-agents, handling their failures, and assembling the results into one answer.",
      "It also covers the unglamorous parts — concurrency, retries, timeouts, cost ceilings, and deciding what to do when one branch comes back empty.",
    ],
    reallyMeans: [
      "It usually means “we added a second model,” and the honest question is whether you needed to. Multi-agent architectures are frequently a way of routing around a context or prompt problem that would have been cheaper to fix directly, and each additional hop adds latency, cost and a new place for the task to be misunderstood.",
      "Where it genuinely earns its place is specialisation with clear handoffs — one component that retrieves, one that drafts, one that checks — because each can then be evaluated and improved separately.",
    ],
    tell: "Ask what a single well-built call with the right context would score on the same eval. If nobody has tried it, the orchestration is a guess.",
    related: ["agent", "agentic", "eval"],
  },
  {
    slug: "context-engineering",
    term: "Context engineering",
    question: "What is context engineering?",
    aliases: ["Prompt engineering", "Context window management"],
    category: "context",
    short:
      "Choosing what the model sees on this call, out of everything it could have seen.",
    means: [
      "A model knows only what is in front of it. Context engineering is the work of selecting, retrieving, compressing and ordering that material — instructions, retrieved passages, prior turns, tool output — so the facts needed are present and the rest is not.",
      "It is bounded by the context window: the maximum amount of text the model can consider at once.",
    ],
    reallyMeans: [
      "It is the successor to prompt engineering, and the rename is earned. Writing a clever instruction is a small part of the job; the hard part is retrieval, selection and eviction at scale, under a token budget, when the source material is a four-hundred-page file and the answer is in two paragraphs of it.",
      "Most incidents filed as “the AI got it wrong” are not reasoning failures. The answer was not in the context. That is an engineering problem with an engineering fix, and it is far cheaper to fix than a model is to replace.",
    ],
    tell: "When an answer is wrong, print the exact context that produced it. If a competent human could not have answered correctly from that context either, the model was never the problem.",
    related: ["harness", "rag", "grounding"],
  },
  {
    slug: "rag",
    term: "RAG",
    question: "What is RAG (retrieval-augmented generation)?",
    aliases: ["Retrieval-augmented generation", "Retrieval augmented generation"],
    category: "context",
    short:
      "Fetch the relevant source material first, then ask the model to answer using it.",
    means: [
      "Rather than relying on what a model absorbed during training, you search your own corpus at question time, place the best-matching passages into the context, and ask for an answer grounded in them. Retrieval, then generation.",
      "It is how a general-purpose model answers questions about documents it has never seen.",
    ],
    reallyMeans: [
      "It means your search quality is now your product quality. RAG is often sold as the cure for hallucination, and it does help — but it relocates the problem rather than removing it. If retrieval returns the wrong three paragraphs, the model will answer fluently and wrongly from those three paragraphs, and it will cite them while doing so.",
      "Almost all the real work in a RAG system is in chunking, indexing, ranking, and knowing when to return nothing at all.",
    ],
    tell: "Ask what the system does when the corpus does not contain the answer. “It says it does not know” is a real answer. “It does its best” is a liability.",
    related: ["context-engineering", "grounding", "hallucination"],
  },
  {
    slug: "mcp",
    term: "MCP",
    question: "What is MCP (Model Context Protocol)?",
    aliases: ["Model Context Protocol", "MCP server"],
    category: "context",
    short:
      "An open standard for connecting AI clients to tools and data, so each integration is written once.",
    means: [
      "MCP defines how an AI application talks to a server that exposes tools, resources and prompts. Rather than every assistant building bespoke integrations with every system, a system exposes one MCP server and any client that speaks the protocol can use it.",
      "The server can be local or remote; the client is whatever the person is working in.",
    ],
    reallyMeans: [
      "It is a standard connector, and like any connector its entire value is adoption. The protocol itself is unremarkable — JSON-RPC and a schema. What matters is that writing one server makes a system reachable from every client that speaks it, instead of writing N integrations for N assistants.",
      "So the practical question is never whether the protocol is elegant. It is whether writing the server costs less than the integrations you would otherwise write, one at a time, forever. Usually it does.",
    ],
    tell: "Count the assistants your team already uses. That number is how many bespoke integrations one MCP server replaces.",
    related: ["tool-use", "agent"],
  },
  {
    slug: "tool-use",
    term: "Tool use",
    question: "What is tool use or function calling?",
    aliases: ["Function calling", "Tool calling"],
    category: "agents",
    short:
      "Letting the model ask your code to do something, then feeding it the result.",
    means: [
      "You describe the available functions — name, purpose, parameters — and the model replies with a structured request to call one. Your code runs it and returns the output, which the model then reads.",
      "The model never executes anything itself. It asks.",
    ],
    reallyMeans: [
      "It means the model's job shifts from knowing to deciding. It does not need to remember your pricing table if it can call the pricing service, and the answer is then correct by construction rather than correct by luck. That is a much better place to be.",
      "The failure mode is not the model picking the wrong tool. It is you exposing a tool with real consequences and no confirmation step. “Send the email” and “draft the email” are one word apart in a tool description and very far apart in an incident report.",
    ],
    tell: "List every tool the model can call and mark the ones that change something in the real world. Those need a human, a dry run, or an undo.",
    related: ["agent", "mcp", "guardrails"],
  },
  {
    slug: "hallucination",
    term: "Hallucination",
    question: "What is an AI hallucination?",
    aliases: ["Confabulation", "Making things up"],
    category: "evaluation",
    short:
      "A fluent, confident, wrong answer — presented exactly like a right one.",
    means: [
      "The model produces text that is plausible given its training and context but is not true. The term is imperfect, since nothing is being perceived: the model is doing what it always does, producing likely continuations, and sometimes a likely continuation is false.",
      "It is not a malfunction. It is the same mechanism that produces the correct answers.",
    ],
    reallyMeans: [
      "The problem is not that models are sometimes wrong — everything is sometimes wrong. The problem is that the confidence signal is flat. A fabricated case citation reads exactly like a real one: same tone, same formatting, same certainty.",
      "So the product question is never “how do we stop it being wrong.” It is “how does being wrong become visible.” Citations that resolve, extracted fields that carry a confidence and a source, and an answer that is allowed to say nothing — those are product decisions, not model decisions.",
    ],
    tell: "Show a known-wrong output to someone in the target profession. If they cannot tell it is wrong without going to the source, the system needs to show its work.",
    related: ["grounding", "eval", "guardrails"],
  },
  {
    slug: "grounding",
    term: "Grounding",
    question: "What does grounding mean in AI?",
    aliases: ["Source attribution", "Citations", "Grounded generation"],
    category: "context",
    short:
      "Tying an answer to the specific source that supports it, so a reader can check.",
    means: [
      "A grounded answer points at where it came from — the document, the passage, the row — rather than asserting from nowhere. It is both a technique (put the source in the context) and a property of the output (the claim carries its citation).",
    ],
    reallyMeans: [
      "Grounding is what turns an AI answer into something a professional can put their name to. In regulated work nobody is permitted to take an assistant's word for anything; they have to be able to point at the authority.",
      "Which is why a citation that does not resolve is worse than no citation at all — it borrows the appearance of rigour without the substance. If you cannot verify the link programmatically before showing it, do not show it.",
    ],
    tell: "Click three citations at random. If any one of them does not lead to a passage that actually supports the claim, the grounding is decorative.",
    related: ["rag", "hallucination", "human-in-the-loop"],
  },
  {
    slug: "eval",
    term: "Eval",
    question: "What is an eval in AI?",
    aliases: ["Evals", "Evaluation", "Benchmark"],
    category: "evaluation",
    short:
      "A repeatable test that tells you whether a change made the system better or worse.",
    means: [
      "A set of realistic inputs, an expected outcome or a grading method, and a score you can run against every change.",
      "Evals are to AI systems what tests are to software, with one difference: outputs are not exactly reproducible, so the result is a distribution rather than a pass or a fail.",
    ],
    reallyMeans: [
      "It is the line between shipping and guessing. Without evals every prompt change is a vibe, every model upgrade is a leap of faith, and nobody can tell you whether last week's fix quietly broke something else.",
      "Building the eval set is also where you discover that nobody ever agreed what “correct” means. That argument is worth having early, with the people whose licence is on the line — not after launch, in an incident review.",
    ],
    tell: "Ask how they knew the last change was an improvement. If the answer is that it looked better, there is no eval.",
    related: ["harness", "hallucination", "iso-42001"],
  },
  {
    slug: "guardrails",
    term: "Guardrails",
    question: "What are AI guardrails?",
    aliases: ["Safety filters", "Constraints", "Policy enforcement"],
    category: "governance",
    short:
      "Constraints that stop a system doing the wrong thing, enforced outside the model.",
    means: [
      "Input and output checks, allowlists, schema validation, refusal rules, rate limits and approval steps that bound what a system can do — implemented in code around the model rather than requested of it in a prompt.",
    ],
    reallyMeans: [
      "If the guardrail is a sentence in the prompt, it is not a guardrail. It is a preference. Anything that genuinely must not happen belongs in code that cannot be talked out of it.",
      "The useful mental model is to assume that on some small fraction of calls the model will attempt the worst action available to it, and then decide which actions you are willing to make available at all.",
    ],
    tell: "Try to talk the system past its own rule. If the only thing standing in the way is the prompt, someone will eventually succeed.",
    related: ["tool-use", "human-in-the-loop", "iso-42001"],
  },
  {
    slug: "human-in-the-loop",
    term: "Human-in-the-loop",
    question: "What does human-in-the-loop mean?",
    aliases: ["HITL", "Human review", "Human oversight"],
    category: "governance",
    short:
      "A person with real authority to change the outcome, positioned where it still matters.",
    means: [
      "A design in which a human reviews, approves, corrects or overrides the system at a defined point — before an action is taken, or before an output is relied on.",
    ],
    reallyMeans: [
      "It is the most over-claimed phrase in enterprise AI. A person shown two hundred outputs an hour and asked to click approve is not in the loop. They are a rubber stamp with liability attached.",
      "Real human-in-the-loop design costs something: fewer items surfaced, better ordering, the uncertain ones first, enough context to actually judge, and a way to disagree that feeds back into the system. If review appears to be free, it is not happening.",
    ],
    tell: "Measure the override rate. If it is near zero, either the system is flawless or nobody is really reviewing. It is not the first one.",
    related: ["guardrails", "grounding", "agent"],
  },
  {
    slug: "iso-42001",
    term: "ISO/IEC 42001",
    question: "What is ISO/IEC 42001?",
    aliases: ["AI management system", "AIMS", "AI governance standard"],
    category: "governance",
    short:
      "The certifiable management-system standard for how an organization runs AI.",
    means: [
      "Published in 2023, ISO/IEC 42001 sets out requirements for an AI management system: how an organization defines AI policy, assesses risk and impact, assigns responsibility, manages the lifecycle of its systems, and improves over time.",
      "It is a management-system standard in the mould of ISO 9001 or 27001. It certifies process, not any particular model.",
    ],
    reallyMeans: [
      "Treated as paperwork, it is paperwork. Built into the release pipeline, it is a sales asset — it turns “how do we know your AI is safe” from a bespoke six-week security review into a document you already have.",
      "The distinction that decides which one you get is where the controls live. Governance written as a policy document drifts from what the product actually does within a quarter. Governance implemented as checks that run on every release cannot drift, because the release fails instead.",
    ],
    tell: "Ask to see the evidence for one control. Note whether it was generated by the pipeline or assembled by hand for the audit.",
    related: ["eval", "guardrails"],
  },
];

export const glossaryBySlug = new Map(glossary.map((t) => [t.slug, t]));
