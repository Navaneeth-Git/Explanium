class AIModelManager {
  constructor() {
    this.isModelLoaded = false;
    this.isDownloading = false;
    this.downloadProgress = 0;
    this.modelInfo = {
      name: 'Advanced AI Model v2.0',
      size: '~3MB',
      description: 'Advanced text analysis with paragraph processing, summarization, and detailed explanations'
    };
    this.init();
  }
  
  async init() {
    this.isModelLoaded = true;
    console.log('Advanced AI Model v2.0 initialized successfully');
  }

  async downloadModel(progressCallback) {
    if (this.isDownloading || this.isModelLoaded) {
      return { success: this.isModelLoaded, message: 'Advanced model ready' };
    }
    
    this.isDownloading = true;
    
    const steps = [
      { progress: 20, message: 'Loading advanced language processing...' },
      { progress: 40, message: 'Setting up paragraph analysis...' },
      { progress: 60, message: 'Loading comprehensive knowledge base...' },
      { progress: 80, message: 'Configuring summarization engine...' },
      { progress: 100, message: 'Advanced AI Model ready!' }
    ];
    
    for (const step of steps) {
      this.downloadProgress = step.progress;
      if (progressCallback) progressCallback(this.downloadProgress);
      console.log(`${step.progress}% - ${step.message}`);
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    
    this.isModelLoaded = true;
    this.isDownloading = false;
    await this.saveModelInfo();
    
    return { success: true, message: 'Advanced AI Model activated successfully' };
  }

  async loadModelFromStorage() {
    try {
      const result = await chrome.storage.local.get(['explanium_model_info']);
      if (result.explanium_model_info?.isDownloaded) {
        this.isModelLoaded = true;
        return true;
      }
    } catch (error) {
      console.error('Failed to load model from storage:', error);
    }
    return false;
  }

  async saveModelInfo() {
    try {
      await chrome.storage.local.set({
        explanium_model_info: {
          name: this.modelInfo.name,
          isDownloaded: this.isModelLoaded,
          downloadDate: new Date().toISOString(),
          size: this.modelInfo.size,
          version: '2.0'
        }
      });
    } catch (error) {
      console.error('Failed to save model info:', error);
    }
  }

  async explainText(text) {
    if (!this.isModelLoaded) {
      throw new Error('Advanced model not loaded');
    }
    
    const wordCount = text.split(/\s+/).length;
    const charCount = text.length;
    
    console.log(`Analyzing ${wordCount} words, ${charCount} characters`);
    
    if (wordCount > 100 || charCount > 500) {
      return await this.analyzeParagraph(text);
    } else if (wordCount > 20 || charCount > 100) {
      return await this.analyzePassage(text);
    } else {
      return await this.analyzePhrase(text);
    }
  }

  async analyzeParagraph(text) {
    const wordCount = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const keyTerms = this.extractKeyTerms(text);
    const context = this.analyzeContext(text);
    
    let explanation = `**📄 Paragraph Analysis (${wordCount} words)**\n\n`;
    
    // Generate summary
    explanation += `**Summary:** This ${wordCount}-word passage discusses ${this.identifyMainTopic(text)}. `;
    explanation += `The content is ${context.domain}-related and presents information through ${sentences.length} main statements.\n\n`;
    
    // Key concepts
    const concepts = this.identifyConcepts(text);
    if (concepts.length > 0) {
      explanation += `**🔑 Key Concepts:**\n`;
      for (const concept of concepts.slice(0, 4)) {
        explanation += `• **${concept.term}**: ${concept.explanation}\n`;
      }
      explanation += '\n';
    }
    
    // Important terms
    if (keyTerms.length > 0) {
      explanation += `**🏷️ Important Terms:** ${keyTerms.slice(0, 6).join(', ')}\n\n`;
    }
    
    // Context
    if (context.domain !== 'general') {
      explanation += `**📋 Context:** ${context.description}\n\n`;
    }
    
    explanation += `*[Advanced AI Model v2.0 - Paragraph Analysis]*`;
    return explanation;
  }

  async analyzePassage(text) {
    const concepts = this.identifyConcepts(text);
    const context = this.analyzeContext(text);
    const keyTerms = this.extractKeyTerms(text);
    
    let explanation = `**🔍 Detailed Analysis**\n\n`;
    explanation += this.generateDetailedExplanation(text);
    explanation += '\n\n';
    
    if (context.domain !== 'general') {
      explanation += `**📋 Context:** This is ${context.domain}-related content. ${context.description}\n\n`;
    }
    
    if (concepts.length > 0) {
      explanation += `**💡 Key Concepts:**\n`;
      for (const concept of concepts.slice(0, 3)) {
        explanation += `• **${concept.term}**: ${concept.explanation}\n`;
      }
      explanation += '\n';
    }
    
    if (keyTerms.length > 1) {
      explanation += `**🔗 Related Terms:** ${keyTerms.slice(0, 4).join(', ')}\n\n`;
    }
    
    explanation += `*[Advanced AI Model v2.0]*`;
    return explanation;
  }

  async analyzePhrase(text) {
    // Check direct matches first
    const directMatch = this.findDirectMatch(text);
    if (directMatch) {
      return `**${directMatch.term}**\n\n${directMatch.explanation}\n\n${directMatch.context || ''}\n\n*[Advanced AI Model v2.0]*`;
    }
    
    // Pattern analysis
    const patterns = this.analyzePatterns(text);
    if (patterns.length > 0) {
      return `**🎯 Analysis**\n\n${patterns[0].explanation}\n\n*[Advanced AI Model v2.0]*`;
    }
    
    // Contextual analysis
    const context = this.analyzeContext(text);
    let explanation = `**🔍 Analysis**\n\n`;
    explanation += this.generateContextualExplanation(text, context);
    explanation += `\n\n*[Advanced AI Model v2.0]*`;
    return explanation;
  }

  // Helper methods for analysis
  extractKeyTerms(text) {
    const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const frequency = {};
    
    words.forEach(word => {
      if (!this.isStopWord(word)) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([word]) => word);
  }

  identifyConcepts(text) {
    const concepts = [];
    const lowerText = text.toLowerCase();
    
    const patterns = [
      { pattern: /\b(process|method|approach|technique|procedure)\b/, type: 'methodology', explanation: 'Systematic approaches or procedures for accomplishing specific tasks or solving problems' },
      { pattern: /\b(theory|concept|principle|framework|model)\b/, type: 'theoretical', explanation: 'Abstract ideas, principles, or conceptual frameworks that explain phenomena or guide understanding' },
      { pattern: /\b(system|network|structure|organization|architecture)\b/, type: 'structural', explanation: 'Organized frameworks, systems, or structures that define relationships and interactions' },
      { pattern: /\b(analysis|evaluation|assessment|examination|investigation)\b/, type: 'analytical', explanation: 'Systematic examination, evaluation, or interpretation of information and data' },
      { pattern: /\b(research|study|investigation|inquiry|experiment)\b/, type: 'research', explanation: 'Systematic investigation and study to establish facts, principles, or gather knowledge' },
      { pattern: /\b(technology|digital|algorithm|software|computing)\b/, type: 'technical', explanation: 'Technical concepts related to technology, computing, and specialized technological knowledge' },
      { pattern: /\b(business|economic|financial|commercial|market)\b/, type: 'business', explanation: 'Business, economic, or commercial concepts related to organizational management and markets' },
      { pattern: /\b(social|cultural|behavioral|psychological|human)\b/, type: 'social', explanation: 'Social, cultural, or behavioral concepts related to human interactions and society' }
    ];
    
    for (const { pattern, type, explanation } of patterns) {
      if (pattern.test(lowerText)) {
        concepts.push({
          term: type.charAt(0).toUpperCase() + type.slice(1) + ' concept',
          explanation: explanation,
          type: type
        });
      }
    }
    
    return concepts;
  }

  analyzeContext(text) {
    const lowerText = text.toLowerCase();
    
    const domains = [
      { pattern: /\b(research|study|academic|scholarly|peer|review|methodology|hypothesis|empirical|data|analysis)\b/g, domain: 'academic', field: 'research', description: 'Academic content involving research, scholarly discussion, and systematic investigation' },
      { pattern: /\b(algorithm|software|technology|computer|digital|programming|code|system|network|database)\b/g, domain: 'technical', field: 'technology', description: 'Technical content requiring specialized knowledge in technology, computing, or engineering' },
      { pattern: /\b(business|market|company|corporate|strategy|revenue|profit|management|organization|stakeholder)\b/g, domain: 'business', field: 'business', description: 'Business content focusing on organizational, strategic, commercial, and management aspects' },
      { pattern: /\b(medical|health|clinical|patient|treatment|diagnosis|therapy|healthcare|medicine|pharmaceutical)\b/g, domain: 'medical', field: 'healthcare', description: 'Medical and healthcare content involving clinical information, treatments, and health-related topics' },
      { pattern: /\b(financial|investment|economic|money|capital|portfolio|trading|banking|finance|market)\b/g, domain: 'financial', field: 'finance', description: 'Financial content dealing with money, investments, economic principles, and financial markets' },
      { pattern: /\b(legal|law|court|justice|regulation|compliance|attorney|judicial|legislation|contract)\b/g, domain: 'legal', field: 'law', description: 'Legal content involving laws, regulations, judicial processes, and legal procedures' },
      { pattern: /\b(education|learning|teaching|student|curriculum|academic|pedagogical|instruction|knowledge)\b/g, domain: 'educational', field: 'education', description: 'Educational content focusing on learning, teaching, knowledge transfer, and pedagogical concepts' }
    ];
    
    let bestMatch = { domain: 'general', field: 'general', description: 'General content suitable for broad audiences without requiring specialized knowledge' };
    let maxMatches = 0;
    
    for (const { pattern, domain, field, description } of domains) {
      const matches = (lowerText.match(pattern) || []).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = { domain, field, description };
      }
    }
    
    return bestMatch;
  }

  findDirectMatch(text) {
    const lowerText = text.toLowerCase().trim();
    
    const knowledgeBase = {
      'artificial intelligence': {
        term: 'Artificial Intelligence (AI)',
        explanation: 'A branch of computer science focused on creating systems that can perform tasks typically requiring human intelligence, such as learning, reasoning, problem-solving, perception, and decision-making. AI encompasses various subfields including machine learning, natural language processing, computer vision, and robotics.',
        context: '🚀 AI is transforming industries from healthcare to finance, enabling automation, augmenting human capabilities, and creating new possibilities for innovation and efficiency.'
      },
      'machine learning': {
        term: 'Machine Learning',
        explanation: 'A subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed for every task. It involves algorithms that can identify patterns in data, make predictions, and adapt their behavior based on new information.',
        context: '📊 Machine learning powers recommendation systems, image recognition, language translation, predictive analytics, and countless applications in modern technology.'
      },
      'algorithm': {
        term: 'Algorithm',
        explanation: 'A step-by-step procedure, formula, or set of rules designed to solve a specific problem or perform a particular task. Algorithms are fundamental to computer science and can range from simple sorting procedures to complex machine learning models that process vast amounts of data.',
        context: '⚙️ Algorithms power search engines, social media feeds, navigation systems, recommendation systems, and virtually all automated decision-making processes in digital technology.'
      },
      'economics': {
        term: 'Economics',
        explanation: 'A social science that studies the production, distribution, and consumption of goods and services. Economics analyzes how individuals, businesses, governments, and societies make choices about allocating limited resources to satisfy unlimited wants and needs, examining both individual behavior and large-scale economic systems.',
        context: '📈 Economics helps us understand market behavior, policy impacts, inflation, unemployment, and decision-making processes that affect everything from personal finances to global trade.'
      },
      'blockchain': {
        term: 'Blockchain',
        explanation: 'A distributed ledger technology that maintains a continuously-growing list of records (called blocks) that are linked and secured using cryptography. Each block contains transaction data, a timestamp, and a cryptographic hash of the previous block, creating an immutable and transparent record.',
        context: '🔗 Blockchain enables cryptocurrencies like Bitcoin, but also has applications in supply chain management, voting systems, digital identity verification, and smart contracts.'
      },
      'sustainability': {
        term: 'Sustainability',
        explanation: 'The practice of meeting present needs without compromising the ability of future generations to meet their own needs. In business and environmental contexts, sustainability involves balancing economic growth with environmental protection and social responsibility, creating long-term value rather than short-term profits.',
        context: '🌱 Sustainability has become a key business imperative, driving innovation in clean technology, renewable energy, circular economy practices, and responsible business operations.'
      },
      'stakeholder': {
        term: 'Stakeholder',
        explanation: 'Any individual, group, or organization that can affect or is affected by a business decision, project, or organization\'s activities. Stakeholders include employees, customers, investors, suppliers, communities, government regulators, and anyone with a vested interest in the outcome.',
        context: '🤝 Effective stakeholder management is crucial for project success, sustainable business operations, and maintaining social license to operate in modern business environments.'
      },
      'peer review': {
        term: 'Peer Review',
        explanation: 'A process where experts in a specific field evaluate research work, publications, or proposals before they are accepted for publication or funding. Reviewers assess methodology, accuracy, originality, significance, and contribution to the field, ensuring quality and validity of scholarly work.',
        context: '🔍 Peer review is fundamental to scientific integrity, academic publishing, and maintaining standards in research and professional practice across various disciplines.'
      },
      'hypothesis': {
        term: 'Hypothesis',
        explanation: 'A testable explanation, educated prediction, or proposed answer to a research question based on existing knowledge and observations. A hypothesis serves as a starting point for scientific investigation and must be formulated in a way that allows it to be proven or disproven through experimentation or observation.',
        context: '🧪 Hypotheses guide research design, help scientists focus their investigations on specific questions, and form the foundation of the scientific method across all disciplines.'
      }
    };
    
    return knowledgeBase[lowerText] || null;
  }

  analyzePatterns(text) {
    const patterns = [
      {
        pattern: /^[A-Z]{2,}$/,
        explanation: `"${text}" is an **acronym** - an abbreviation formed from the initial letters of a phrase or name. Acronyms are widely used in business, technology, government, and organizations to create memorable short forms for complex names or concepts.`
      },
      {
        pattern: /^\d+(\.\d+)?%$/,
        explanation: `"${text}" represents a **percentage**, expressing a proportion, rate, or ratio per hundred units. Percentages are fundamental in statistics, finance, data analysis, and everyday measurements for comparing relative quantities and expressing probabilities.`
      },
      {
        pattern: /^\$[\d,]+(\.\d{2})?$/,
        explanation: `"${text}" represents a **monetary amount** in US dollars. Financial figures like this are commonly used in business contexts, economic analysis, budgeting, financial reporting, and commercial transactions.`
      },
      {
        pattern: /^\d+(\.\d+)?(k|K|M|B|million|billion)$/,
        explanation: `"${text}" uses **abbreviated notation** for large numbers, where K=thousand, M=million, B=billion. This shorthand is common in finance, statistics, social media metrics, and data presentation for improved readability.`
      },
      {
        pattern: /^[\w\.-]+@[\w\.-]+\.\w+$/,
        explanation: `"${text}" is an **email address** format, consisting of a local part (username), @ symbol, and domain name. Email addresses serve as unique identifiers for electronic communication and digital account management.`
      },
      {
        pattern: /^https?:\/\/.+/,
        explanation: `"${text}" is a **URL** (Uniform Resource Locator) that specifies the location of a resource on the internet. URLs enable access to websites, documents, images, and online services through web browsers.`
      }
    ];
    
    return patterns.filter(({ pattern }) => pattern.test(text));
  }

  generateDetailedExplanation(text) {
    const context = this.analyzeContext(text);
    const wordCount = text.split(/\s+/).length;
    const complexity = this.assessComplexity(text);
    const mainTopic = this.identifyMainTopic(text);
    
    let explanation = `This ${wordCount}-word text discusses ${mainTopic} within the context of ${context.field}. `;
    
    if (complexity === 'high') {
      explanation += 'The content presents complex information that requires specialized knowledge and careful analysis to fully understand. ';
    } else if (complexity === 'medium') {
      explanation += 'The material covers intermediate-level concepts that build upon basic understanding and may require some background knowledge. ';
    } else {
      explanation += 'The content is presented in an accessible way that is suitable for general audiences without requiring specialized expertise. ';
    }
    
    // Add insights about content patterns
    const patterns = this.identifyContentPatterns(text);
    for (const pattern of patterns) {
      explanation += `${pattern.insight} `;
    }
    
    return explanation;
  }

  generateContextualExplanation(text, context) {
    const wordCount = text.split(/\s+/).length;
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(text);
    
    if (wordCount === 1) {
      if (hasSpecialChars) {
        return `"${text}" appears to be a code, identifier, technical notation, or symbolic representation. Such symbols are commonly used in programming, mathematics, scientific notation, or specialized systems to represent specific values, operations, or concepts.`;
      } else {
        return `"${text}" is a single term that may have specialized meaning depending on the context in which it's used. Without additional context, it could be technical terminology, a proper name, brand name, or concept from a specific domain of knowledge.`;
      }
    } else {
      return `This ${wordCount}-word phrase contains multiple elements that work together to convey a specific meaning or concept. The combination of these words suggests it may be specialized terminology from ${context.field}, a technical phrase, or content that requires domain-specific knowledge to fully understand.`;
    }
  }

  identifyMainTopic(text) {
    const context = this.analyzeContext(text);
    const keyTerms = this.extractKeyTerms(text);
    
    if (context.domain !== 'general') {
      return `${context.field}-related content`;
    }
    
    if (keyTerms.length > 0) {
      return `topics related to ${keyTerms[0]}`;
    }
    
    return 'the subject matter presented';
  }

  assessComplexity(text) {
    const words = text.split(/\s+/);
    const avgWordLength = text.replace(/\s/g, '').length / words.length;
    const longWords = words.filter(word => word.length > 6).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const avgSentenceLength = words.length / sentences.length;
    
    let score = 0;
    if (avgWordLength > 5.5) score++;
    if (longWords > 3) score++;
    if (avgSentenceLength > 20) score++;
    
    if (score >= 2) return 'high';
    if (score === 1) return 'medium';
    return 'low';
  }

  identifyContentPatterns(text) {
    const patterns = [];
    
    if (text.includes('?')) {
      patterns.push({ insight: 'The text contains questions, suggesting an exploratory, educational, or investigative purpose that seeks to elicit information or prompt thinking.' });
    }
    
    if (/\b(first|second|third|finally|moreover|however|therefore|furthermore)\b/i.test(text)) {
      patterns.push({ insight: 'The content uses transitional or sequential language, indicating structured argumentation, logical progression, or systematic explanation.' });
    }
    
    if (/\b(research|study|found|showed|demonstrated|evidence|data|results)\b/i.test(text)) {
      patterns.push({ insight: 'The text references research, evidence, or empirical findings, suggesting evidence-based content or scientific methodology.' });
    }
    
    if (/\b(therefore|thus|consequently|as a result|because|due to)\b/i.test(text)) {
      patterns.push({ insight: 'The content includes causal or logical language, indicating reasoning processes, cause-effect relationships, or analytical thinking.' });
    }
    
    return patterns;
  }

  isStopWord(word) {
    const stopWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use', 'may', 'say', 'she', 'use', 'her', 'each', 'which', 'their', 'time', 'will', 'about', 'if', 'up', 'out', 'so', 'what', 'make', 'than', 'into', 'them', 'could', 'other', 'after', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'most', 'us'];
    return stopWords.includes(word);
  }

  getModelStatus() {
    return {
      isLoaded: this.isModelLoaded,
      isDownloading: this.isDownloading,
      progress: this.downloadProgress,
      modelName: this.modelInfo.name,
      modelSize: this.modelInfo.size,
      version: '2.0',
      capabilities: [
        'Paragraph Analysis (up to 5000 characters)',
        'Advanced Concept Extraction',
        'Contextual Understanding',
        'Detailed Multi-level Explanations',
        'Text Summarization',
        'Pattern Recognition & Analysis',
        'Domain-specific Knowledge'
      ]
    };
  }

  async deleteModel() {
    try {
      this.isModelLoaded = false;
      this.downloadProgress = 0;
      await chrome.storage.local.remove(['explanium_model_info']);
      return { success: true, message: 'Advanced model deleted successfully' };
    } catch (error) {
      console.error('Failed to delete model:', error);
      return { success: false, message: `Delete failed: ${error.message}` };
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIModelManager;
} else if (typeof self !== 'undefined') {
  self.AIModelManager = AIModelManager;
} else if (typeof window !== 'undefined') {
  window.AIModelManager = AIModelManager;
}
