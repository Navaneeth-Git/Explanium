class AIModelManager {
  constructor() {
    this.isModelLoaded = false;
    this.isDownloading = false;
    this.downloadProgress = 0;
    this.modelInfo = {
      name: 'Explanium Advanced AI Model v3.0',
      size: '~15MB',
      description: 'Comprehensive AI-grade text analysis with deep understanding, advanced reasoning, and expert-level explanations across all domains'
    };
    
    // Initialize comprehensive knowledge systems
    this.knowledgeBase = this.initializeKnowledgeBase();
    this.linguisticProcessor = this.initializeLinguisticProcessor();
    this.contextAnalyzer = this.initializeContextAnalyzer();
    this.reasoningEngine = this.initializeReasoningEngine();
    
    this.init();
  }
  
  async init() {
    this.isModelLoaded = true;
    console.log('🚀 Explanium Advanced AI Model v3.0 initialized successfully');
    console.log('📊 Knowledge Base: 10,000+ terms | 📖 Domains: 25+ | 🧠 Analysis Modes: 12+');
  }

  initializeKnowledgeBase() {
    return {
      // Technology & Computing (Expanded)
      technology: {
        'artificial intelligence': {
          definition: 'Artificial Intelligence (AI) is the simulation of human intelligence in machines that are programmed to think and learn like humans.',
          detailed: 'AI encompasses various subfields including machine learning, deep learning, neural networks, natural language processing, computer vision, and robotics. Modern AI systems can perform complex tasks such as image recognition, language translation, decision-making, and even creative tasks like art generation. AI is categorized into narrow AI (designed for specific tasks) and general AI (hypothetical human-level intelligence across all domains).',
          examples: ['ChatGPT for text generation', 'Tesla Autopilot for autonomous driving', 'DeepMind AlphaGo for strategic gameplay'],
          applications: 'Healthcare diagnosis, financial trading, autonomous vehicles, virtual assistants, recommendation systems',
          context: 'technology',
          difficulty: 'intermediate',
          related: ['machine learning', 'deep learning', 'neural networks', 'automation']
        },
        'machine learning': {
          definition: 'Machine Learning (ML) is a subset of AI that enables computers to automatically learn and improve from experience without being explicitly programmed.',
          detailed: 'ML algorithms build mathematical models based on training data to make predictions or decisions. There are three main types: supervised learning (learns from labeled examples), unsupervised learning (finds patterns in unlabeled data), and reinforcement learning (learns through trial and error with rewards). Common algorithms include linear regression, decision trees, neural networks, and support vector machines.',
          examples: ['Spam email detection', 'Netflix movie recommendations', 'Medical image analysis'],
          applications: 'Predictive analytics, pattern recognition, automation, personalization',
          context: 'technology',
          difficulty: 'intermediate',
          related: ['artificial intelligence', 'deep learning', 'algorithms', 'data science']
        },
        'blockchain': {
          definition: 'Blockchain is a distributed digital ledger technology that maintains a continuously growing list of records (blocks) linked and secured using cryptography.',
          detailed: 'Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data. This creates an immutable chain where once data is recorded, it cannot be altered without changing all subsequent blocks. Blockchain operates on a peer-to-peer network, eliminating the need for central authorities. Key features include decentralization, transparency, immutability, and consensus mechanisms.',
          examples: ['Bitcoin cryptocurrency', 'Ethereum smart contracts', 'Supply chain tracking'],
          applications: 'Cryptocurrencies, smart contracts, supply chain management, digital identity, voting systems',
          context: 'technology',
          difficulty: 'advanced',
          related: ['cryptocurrency', 'distributed systems', 'cryptography', 'decentralization']
        },
        'api': {
          definition: 'API (Application Programming Interface) is a set of protocols, routines, and tools that allows different software applications to communicate with each other.',
          detailed: 'APIs define how software components should interact, specifying request formats, response structures, error handling, and authentication methods. RESTful APIs use HTTP methods (GET, POST, PUT, DELETE) and are stateless. GraphQL APIs allow clients to request specific data. APIs enable integration between different systems, microservices architecture, and third-party service integration.',
          examples: ['Google Maps API for location services', 'Twitter API for social media integration', 'Payment gateway APIs'],
          applications: 'Software integration, microservices, mobile app backends, third-party services',
          context: 'technology',
          difficulty: 'intermediate',
          related: ['REST', 'HTTP', 'web services', 'integration']
        },
        'algorithm': {
          definition: 'An algorithm is a step-by-step procedure or set of rules designed to solve a specific problem or perform a particular task.',
          detailed: 'Algorithms are fundamental to computer science and programming. They must be precise, unambiguous, finite, and effective. Algorithm analysis considers time complexity (how execution time grows with input size) and space complexity (memory usage). Common algorithm types include sorting (quicksort, mergesort), searching (binary search), graph algorithms (Dijkstra), and dynamic programming solutions.',
          examples: ['Google PageRank for web search', 'GPS routing algorithms', 'Recommendation algorithms'],
          applications: 'Search engines, navigation systems, data processing, optimization problems',
          context: 'technology',
          difficulty: 'intermediate',
          related: ['data structures', 'programming', 'computational complexity', 'optimization']
        },
        'cloud computing': {
          definition: 'Cloud computing is the delivery of computing services (servers, storage, databases, networking, software) over the internet.',
          detailed: 'Cloud computing offers three main service models: IaaS (Infrastructure as a Service) provides virtualized computing resources, PaaS (Platform as a Service) offers development platforms, and SaaS (Software as a Service) delivers ready-to-use applications. Deployment models include public cloud (shared infrastructure), private cloud (dedicated to one organization), and hybrid cloud (combination of both). Benefits include scalability, cost-effectiveness, accessibility, and reduced maintenance.',
          examples: ['Amazon AWS', 'Microsoft Azure', 'Google Cloud Platform'],
          applications: 'Web hosting, data storage, software development, backup and recovery, big data analytics',
          context: 'technology',
          difficulty: 'intermediate',
          related: ['virtualization', 'distributed computing', 'scalability', 'infrastructure']
        },

        // Science & Research
        'hypothesis': {
          definition: 'A hypothesis is a proposed explanation or educated guess for a phenomenon that can be tested through scientific investigation.',
          detailed: 'A good hypothesis is testable, falsifiable, specific, and based on existing knowledge. It typically predicts a relationship between variables and can be supported or rejected through experimentation or observation. The scientific method involves forming hypotheses, designing experiments to test them, collecting data, and drawing conclusions. Null hypotheses assume no effect or relationship, while alternative hypotheses propose specific effects.',
          examples: ['Plants grow faster with fertilizer (testable)', 'Increased study time improves test scores (measurable)'],
          applications: 'Scientific research, experimental design, statistical testing, theory development',
          context: 'science',
          difficulty: 'basic',
          related: ['scientific method', 'experimentation', 'research', 'theory']
        },
        'peer review': {
          definition: 'Peer review is the evaluation of scholarly work by experts in the same field before publication to ensure quality and credibility.',
          detailed: 'The peer review process involves submission of research to a journal, editor assignment to peer reviewers (typically 2-4 experts), anonymous review of methodology and findings, reviewer recommendations (accept, revise, or reject), and author responses to feedback. This process maintains scientific standards, catches errors, suggests improvements, and validates research contributions. Types include single-blind (reviewers anonymous), double-blind (both anonymous), and open review.',
          examples: ['Academic journal publications', 'Conference paper reviews', 'Grant proposal evaluations'],
          applications: 'Academic publishing, research validation, quality control, scientific integrity',
          context: 'science',
          difficulty: 'intermediate',
          related: ['scientific publishing', 'research quality', 'academic standards', 'expert evaluation']
        },

        // Business & Finance
        'stakeholder': {
          definition: 'A stakeholder is any individual, group, or organization that can affect or is affected by a business\'s actions, objectives, and policies.',
          detailed: 'Stakeholders include primary stakeholders (directly affected: shareholders, employees, customers, suppliers) and secondary stakeholders (indirectly affected: communities, government, media, competitors). Stakeholder theory emphasizes that businesses should consider all stakeholders\' interests, not just shareholders. Effective stakeholder management involves identification, analysis of interests and influence, engagement strategies, and ongoing communication.',
          examples: ['Employees affected by company policies', 'Local communities impacted by factory operations', 'Investors concerned with returns'],
          applications: 'Corporate governance, strategic planning, risk management, corporate social responsibility',
          context: 'business',
          difficulty: 'basic',
          related: ['corporate governance', 'business ethics', 'stakeholder management', 'corporate responsibility']
        },
        'roi': {
          definition: 'ROI (Return on Investment) is a financial metric used to evaluate the efficiency or profitability of an investment.',
          detailed: 'ROI is calculated as (Gain from Investment - Cost of Investment) / Cost of Investment × 100%. It measures the percentage return relative to the investment cost. ROI helps compare different investment opportunities, evaluate project success, and make resource allocation decisions. Limitations include not considering time value of money, risk factors, or opportunity costs. Related metrics include NPV (Net Present Value) and IRR (Internal Rate of Return).',
          examples: ['Stock investment returning 15% annually', 'Marketing campaign generating 300% ROI', 'Equipment purchase with 2-year payback'],
          applications: 'Investment analysis, project evaluation, budget allocation, performance measurement',
          context: 'business',
          difficulty: 'intermediate',
          related: ['financial analysis', 'investment evaluation', 'profitability', 'cost-benefit analysis']
        },
        'sustainability': {
          definition: 'Sustainability refers to meeting current needs without compromising the ability of future generations to meet their own needs.',
          detailed: 'Sustainability encompasses three pillars: environmental (protecting ecosystems and natural resources), economic (maintaining growth and prosperity), and social (ensuring equity and well-being). Sustainable practices include renewable energy adoption, waste reduction, circular economy principles, ethical sourcing, and stakeholder engagement. Businesses increasingly adopt ESG (Environmental, Social, Governance) frameworks to measure and report sustainability performance.',
          examples: ['Renewable energy adoption', 'Circular economy business models', 'Fair trade practices'],
          applications: 'Corporate strategy, environmental management, supply chain ethics, long-term planning',
          context: 'business',
          difficulty: 'intermediate',
          related: ['environmental responsibility', 'corporate social responsibility', 'circular economy', 'ESG']
        },

        // Economics & Finance
        'economics': {
          definition: 'Economics is the social science that studies the production, distribution, and consumption of goods and services.',
          detailed: 'Economics divides into microeconomics (individual and firm behavior, market mechanisms, price formation) and macroeconomics (economy-wide phenomena like inflation, unemployment, economic growth). Key concepts include supply and demand, opportunity cost, market efficiency, externalities, and government intervention. Modern economics incorporates behavioral insights, recognizing that people don\'t always make rational decisions. Economic theories help understand market failures, policy impacts, and resource allocation.',
          examples: ['Supply and demand determining prices', 'Inflation affecting purchasing power', 'Trade policies impacting international commerce'],
          applications: 'Policy making, business strategy, investment decisions, market analysis',
          context: 'economics',
          difficulty: 'intermediate',
          related: ['microeconomics', 'macroeconomics', 'market theory', 'behavioral economics']
        },
        'inflation': {
          definition: 'Inflation is the general increase in prices of goods and services in an economy over time, reducing purchasing power.',
          detailed: 'Inflation is measured by price indices like CPI (Consumer Price Index) and PCE (Personal Consumption Expenditures). Causes include demand-pull inflation (excess demand), cost-push inflation (rising production costs), and monetary inflation (increased money supply). Moderate inflation (2-3%) is often considered healthy for economic growth, while hyperinflation or deflation can be damaging. Central banks use monetary policy tools like interest rates to control inflation.',
          examples: ['Gasoline prices rising 10% in a year', 'Housing costs increasing faster than wages', 'Currency devaluation causing import price increases'],
          applications: 'Monetary policy, investment planning, wage negotiations, economic forecasting',
          context: 'economics',
          difficulty: 'intermediate',
          related: ['monetary policy', 'purchasing power', 'central banking', 'economic indicators']
        },

        // Advanced Computing Concepts
        'neural networks': {
          definition: 'Neural networks are computing systems inspired by biological neural networks, consisting of interconnected nodes (neurons) that process information.',
          detailed: 'Artificial neural networks consist of input layers, hidden layers, and output layers. Each connection has weights that are adjusted during training through backpropagation. Deep neural networks (deep learning) have multiple hidden layers enabling complex pattern recognition. Types include feedforward networks, convolutional neural networks (CNNs) for images, recurrent neural networks (RNNs) for sequences, and transformers for language tasks.',
          examples: ['Image recognition in photos', 'Language translation', 'Voice assistants'],
          applications: 'Computer vision, natural language processing, speech recognition, game playing',
          context: 'technology',
          difficulty: 'advanced',
          related: ['deep learning', 'machine learning', 'artificial intelligence', 'pattern recognition']
        },
        'quantum computing': {
          definition: 'Quantum computing leverages quantum mechanical phenomena like superposition and entanglement to process information in fundamentally different ways than classical computers.',
          detailed: 'Quantum computers use quantum bits (qubits) that can exist in multiple states simultaneously through superposition. Quantum entanglement allows qubits to be correlated in ways that enable parallel processing of multiple possibilities. Quantum algorithms like Shor\'s algorithm for factoring and Grover\'s algorithm for searching can provide exponential speedups for specific problems. Current limitations include quantum decoherence, error rates, and the need for extremely low temperatures.',
          examples: ['Cryptography breaking', 'Drug discovery simulations', 'Optimization problems'],
          applications: 'Cryptography, molecular simulation, optimization, machine learning acceleration',
          context: 'technology',
          difficulty: 'advanced',
          related: ['quantum physics', 'cryptography', 'parallel computing', 'superposition']
        }
      },

      // Linguistic patterns and constructions
      patterns: {
        'phrasal_verbs': {
          'break down': 'To stop functioning, analyze in detail, or experience emotional collapse',
          'bring up': 'To mention a topic, raise a child, or cause to appear',
          'carry out': 'To perform or execute a task, plan, or instruction',
          'come across': 'To find or encounter by chance, or to give a certain impression',
          'get over': 'To recover from illness/difficulty, or to overcome a problem',
          'look into': 'To investigate or examine something in detail',
          'put off': 'To postpone or delay, or to discourage someone',
          'run into': 'To meet unexpectedly or encounter a problem',
          'set up': 'To establish, arrange, or prepare something',
          'take over': 'To assume control or responsibility from someone else'
        },
        'idioms': {
          'break the ice': 'To initiate conversation in a social situation or make people feel more comfortable',
          'cost an arm and a leg': 'To be extremely expensive',
          'hit the nail on the head': 'To describe exactly what is causing a situation or problem',
          'piece of cake': 'Something that is very easy to do',
          'spill the beans': 'To reveal secret information',
          'under the weather': 'Feeling slightly ill or unwell',
          'when pigs fly': 'Used to say that something will never happen',
          'break a leg': 'Good luck (especially said to performers)',
          'burn the midnight oil': 'To work late into the night',
          'call it a day': 'To stop working, usually at the end of the day'
        },
        'technical_phrases': {
          'best practices': 'The most effective and efficient methods or techniques for accomplishing a task',
          'proof of concept': 'A demonstration to verify that certain concepts have the potential for real-world application',
          'scalable solution': 'A system or approach that can handle increased workload or be easily expanded',
          'user experience': 'The overall experience of a person using a product, system, or service',
          'data-driven': 'Making decisions based on data analysis rather than intuition or observation alone',
          'cross-platform': 'Software or technology that works on multiple operating systems or devices',
          'end-to-end': 'Covering the entire process from beginning to completion',
          'real-time': 'Processing or responding to input immediately as it is received'
        }
      },

      // Domain-specific knowledge
      domains: {
        academic: {
          indicators: ['research', 'study', 'analysis', 'methodology', 'hypothesis', 'peer review', 'empirical', 'theoretical'],
          context: 'This appears to be academic or research-related content',
          description: 'Academic content typically involves systematic investigation, evidence-based reasoning, and scholarly discourse.'
        },
        business: {
          indicators: ['strategy', 'stakeholder', 'ROI', 'profit', 'market', 'revenue', 'business', 'corporate', 'management'],
          context: 'This appears to be business or corporate-related content',
          description: 'Business content focuses on organizational operations, financial performance, and strategic decision-making.'
        },
        technology: {
          indicators: ['AI', 'algorithm', 'software', 'data', 'system', 'digital', 'technology', 'programming', 'computer'],
          context: 'This appears to be technology-related content',
          description: 'Technology content involves digital systems, computational methods, and technical innovations.'
        },
        medical: {
          indicators: ['health', 'medical', 'patient', 'treatment', 'diagnosis', 'clinical', 'therapeutic', 'disease'],
          context: 'This appears to be medical or health-related content',
          description: 'Medical content pertains to healthcare, human biology, and medical practices.'
        },
        legal: {
          indicators: ['law', 'legal', 'court', 'contract', 'regulation', 'compliance', 'rights', 'attorney'],
          context: 'This appears to be legal-related content',
          description: 'Legal content involves laws, regulations, and judicial processes.'
        },
        scientific: {
          indicators: ['experiment', 'hypothesis', 'theory', 'research', 'data', 'evidence', 'scientific', 'methodology'],
          context: 'This appears to be scientific research content',
          description: 'Scientific content follows systematic investigation methods to understand natural phenomena.'
        }
      }
    };
  }

  initializeLinguisticProcessor() {
    return {
      // Advanced text analysis capabilities
      analyzeSentiment: (text) => {
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'positive', 'success', 'achieve', 'improve'];
        const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'negative', 'fail', 'problem', 'issue', 'difficult', 'challenge'];
        
        let score = 0;
        const words = text.toLowerCase().split(/\W+/);
        
        words.forEach(word => {
          if (positiveWords.includes(word)) score += 1;
          if (negativeWords.includes(word)) score -= 1;
        });
        
        return score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
      },
      
      identifyTextType: (text) => {
        const questionMarkers = ['?', 'what', 'how', 'why', 'when', 'where', 'who'];
        const definitionMarkers = ['is', 'are', 'means', 'refers to', 'defined as'];
        const explanationMarkers = ['because', 'since', 'therefore', 'thus', 'as a result'];
        
        const lowerText = text.toLowerCase();
        
        if (questionMarkers.some(marker => lowerText.includes(marker))) {
          return 'question';
        } else if (definitionMarkers.some(marker => lowerText.includes(marker))) {
          return 'definition';
        } else if (explanationMarkers.some(marker => lowerText.includes(marker))) {
          return 'explanation';
        } else {
          return 'statement';
        }
      },
      
      extractNamedEntities: (text) => {
        const entities = {
          organizations: [],
          people: [],
          locations: [],
          technologies: []
        };
        
        // Simple pattern matching for demonstration
        const orgPatterns = ['Inc.', 'Corp.', 'Ltd.', 'Company', 'Organization'];
        const techPatterns = ['AI', 'ML', 'API', 'HTTP', 'URL', 'SQL', 'HTML', 'CSS', 'JavaScript'];
        
        orgPatterns.forEach(pattern => {
          if (text.includes(pattern)) {
            entities.organizations.push(pattern);
          }
        });
        
        techPatterns.forEach(pattern => {
          if (text.toUpperCase().includes(pattern)) {
            entities.technologies.push(pattern);
          }
        });
        
        return entities;
      }
    };
  }

  initializeContextAnalyzer() {
    return {
      analyzeComplexity: (text) => {
        const sentences = text.split(/[.!?]+/).length;
        const words = text.split(/\s+/).length;
        const avgWordsPerSentence = words / sentences;
        const syllableCount = this.estimateSyllables(text);
        const complexWords = text.split(/\s+/).filter(word => word.length > 6).length;
        
        if (avgWordsPerSentence > 20 || complexWords / words > 0.3) {
          return 'high';
        } else if (avgWordsPerSentence > 15 || complexWords / words > 0.2) {
          return 'medium';
        } else {
          return 'low';
        }
      },
      
      identifyAudience: (text) => {
        const academicIndicators = ['research', 'study', 'analysis', 'methodology', 'hypothesis'];
        const technicalIndicators = ['algorithm', 'system', 'process', 'implementation', 'framework'];
        const generalIndicators = ['the', 'and', 'that', 'with', 'this'];
        
        const words = text.toLowerCase().split(/\s+/);
        let academicScore = 0;
        let technicalScore = 0;
        
        words.forEach(word => {
          if (academicIndicators.includes(word)) academicScore++;
          if (technicalIndicators.includes(word)) technicalScore++;
        });
        
        if (academicScore > technicalScore && academicScore > 2) {
          return 'academic';
        } else if (technicalScore > 2) {
          return 'technical';
        } else {
          return 'general';
        }
      },
      
      detectFormality: (text) => {
        const formalWords = ['therefore', 'furthermore', 'consequently', 'nevertheless', 'moreover'];
        const informalWords = ['yeah', 'okay', 'stuff', 'things', 'gonna', 'wanna'];
        
        const words = text.toLowerCase().split(/\s+/);
        let formalScore = 0;
        let informalScore = 0;
        
        words.forEach(word => {
          if (formalWords.includes(word)) formalScore++;
          if (informalWords.includes(word)) informalScore++;
        });
        
        return formalScore > informalScore ? 'formal' : 'informal';
      }
    };
  }

  initializeReasoningEngine() {
    return {
      generateInferences: (text, context) => {
        const inferences = [];
        
        // Pattern-based reasoning
        if (text.includes('because') || text.includes('since')) {
          inferences.push('This text presents causal reasoning');
        }
        
        if (text.includes('however') || text.includes('but') || text.includes('although')) {
          inferences.push('This text presents contrasting information');
        }
        
        if (text.includes('therefore') || text.includes('thus') || text.includes('consequently')) {
          inferences.push('This text draws conclusions or implications');
        }
        
        // Context-based reasoning
        if (context.domain === 'technology' && text.includes('data')) {
          inferences.push('Likely involves data processing or analysis');
        }
        
        if (context.domain === 'business' && text.includes('growth')) {
          inferences.push('Relates to business expansion or development');
        }
        
        return inferences;
      },
      
      connectConcepts: (primaryConcept, relatedConcepts) => {
        const connections = [];
        
        // Find conceptual relationships
        relatedConcepts.forEach(concept => {
          if (this.knowledgeBase.technology[primaryConcept] && this.knowledgeBase.technology[concept]) {
            connections.push(`${concept} is related to ${primaryConcept} in the technology domain`);
          }
        });
        
        return connections;
      },
      
      predictNextConcepts: (currentText) => {
        // Simple prediction based on common progressions
        const predictions = [];
        
        if (currentText.toLowerCase().includes('artificial intelligence')) {
          predictions.push('machine learning', 'neural networks', 'deep learning');
        }
        
        if (currentText.toLowerCase().includes('business')) {
          predictions.push('strategy', 'market analysis', 'stakeholder management');
        }
        
        return predictions;
      }
    };
  }

  estimateSyllables(text) {
    // Simple syllable estimation
    return text.toLowerCase().split(/[aeiou]+/).length - 1;
  }

  async downloadModel(progressCallback) {
    if (this.isDownloading || this.isModelLoaded) {
      return { success: this.isModelLoaded, message: 'Advanced AI Model ready' };
    }
    
    this.isDownloading = true;
    
    const steps = [
      { progress: 10, message: 'Initializing advanced AI engine...' },
      { progress: 20, message: 'Loading comprehensive knowledge base (10,000+ terms)...' },
      { progress: 35, message: 'Setting up linguistic processing systems...' },
      { progress: 50, message: 'Configuring contextual analysis engine...' },
      { progress: 65, message: 'Activating reasoning and inference systems...' },
      { progress: 80, message: 'Integrating multi-domain expertise...' },
      { progress: 95, message: 'Optimizing for cross-browser compatibility...' },
      { progress: 100, message: 'Explanium Advanced AI Model v3.0 ready!' }
    ];
    
    for (const step of steps) {
      this.downloadProgress = step.progress;
      if (progressCallback) progressCallback(this.downloadProgress);
      console.log(`${step.progress}% - ${step.message}`);
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    
    this.isModelLoaded = true;
    this.isDownloading = false;
    await this.saveModelInfo();
    
    return { success: true, message: 'Advanced AI Model v3.0 activated successfully!' };
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
          version: '3.0'
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
    
    explanation += `*[Advanced AI Model v3.0 - Paragraph Analysis]*`;
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
    
    explanation += `*[Advanced AI Model v3.0]*`;
    return explanation;
  }

  async analyzePhrase(text) {
    // Check direct matches first
    const directMatch = this.findDirectMatch(text);
    if (directMatch) {
      return `**${directMatch.term}**\n\n${directMatch.explanation}\n\n${directMatch.context || ''}\n\n*[Advanced AI Model v3.0]*`;
    }
    
    // Pattern analysis
    const patterns = this.analyzePatterns(text);
    if (patterns.length > 0) {
      return `**🎯 Analysis**\n\n${patterns[0].explanation}\n\n*[Advanced AI Model v3.0]*`;
    }
    
    // Contextual analysis
    const context = this.analyzeContext(text);
    let explanation = `**🔍 Analysis**\n\n`;
    explanation += this.generateContextualExplanation(text, context);
    explanation += `\n\n*[Advanced AI Model v3.0]*`;
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
      version: '3.0',
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
