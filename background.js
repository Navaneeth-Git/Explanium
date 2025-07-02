// Import AI Model Manager
importScripts('ai-model-manager.js');

class ExplaniumBackgroundService {
  constructor() {
    this.aiSession = null; // Chrome AI session (Primary - Gemini Nano)
    this.aiModelManager = new AIModelManager(); // Custom AI model (Fallback)
    this.isInitialized = false;
    this.initializationPromise = null;
    this.chromeAiAvailable = false;
    
    this.init();
  }
  
  async init() {
    // Listen for messages from content scripts and options page
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('📨 Background received message:', request);
      
      if (request.action === 'explainText') {
        console.log('🤖 Processing text explanation request for:', request.text);
        this.handleExplainText(request.text)
          .then(response => {
            console.log('✅ Sending explanation response:', response);
            sendResponse(response);
          })
          .catch(error => {
            console.error('❌ Background explanation error:', error);
            sendResponse({
              success: false,
              error: error.message || 'Explanation failed'
            });
          });
        return true; // Keep message channel open for async response
      } else if (request.action === 'checkAIStatus') {
        this.checkAIStatus()
          .then(response => sendResponse(response))
          .catch(error => sendResponse({
            available: false,
            error: error.message
          }));
        return true; // Keep message channel open for async response
      } else if (request.action === 'downloadModel') {
        this.handleModelDownload(request.progressCallback)
          .then(response => sendResponse(response))
          .catch(error => sendResponse({
            success: false,
            error: error.message
          }));
        return true; // Keep message channel open for async response
      } else if (request.action === 'getModelStatus') {
        const status = this.aiModelManager.getModelStatus();
        sendResponse(status);
      } else if (request.action === 'deleteModel') {
        this.aiModelManager.deleteModel()
          .then(response => sendResponse(response))
          .catch(error => sendResponse({
            success: false,
            error: error.message
          }));
        return true; // Keep message channel open for async response
      }
    });
    
    // Initialize AI models - Chrome AI first (primary)
    this.initializeChromeAI();
    this.initializeCustomModel();
  }
  
  async initializeChromeAI() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    
    this.initializationPromise = this._initializeChromeAI();
    return this.initializationPromise;
  }
  
  async _initializeChromeAI() {
    try {
      // Check if Chrome's built-in AI is available (includes Gemini Nano)
      if (typeof self !== 'undefined' && 'ai' in self && 'languageModel' in self.ai) {
        console.log('🚀 Initializing Chrome built-in AI (Gemini Nano)...');
        
        const capabilities = await self.ai.languageModel.capabilities();
        console.log('AI Capabilities:', capabilities);
        
        if (capabilities.available === 'readily') {
          this.aiSession = await self.ai.languageModel.create({
            systemPrompt: `You are an expert knowledge assistant that provides accurate, detailed explanations for any text. Your goal is to give users comprehensive understanding.

CORE PRINCIPLES:
- Always prioritize accuracy over brevity
- Provide context and real-world relevance
- Use clear, professional language
- Give practical examples when applicable
- Explain both simple and complex concepts thoroughly

RESPONSE FORMATS:
• Single words: Definition + context + usage examples
• Technical terms: Simple explanation + detailed breakdown + applications
• Phrases/idioms: Meaning + origin/context + usage scenarios  
• Sentences: Key points + concept explanations + significance
• Paragraphs: Summary + main concepts + detailed analysis
• Acronyms: Full form + meaning + context + usage examples
• Numbers/data: What it represents + context + significance
• URLs/emails: Format explanation + purpose + usage context

QUALITY STANDARDS:
- Be thorough but organized
- Include relevant background information
- Provide multiple perspectives when relevant
- Use examples that aid understanding
- Explain technical concepts in accessible terms
- Always aim to educate and inform comprehensively`
          });
          
          // Test the AI session
          const testResponse = await this.aiSession.prompt('Test: AI');
          console.log('✅ Chrome AI test successful:', testResponse);
          
          this.chromeAiAvailable = true;
          this.isInitialized = true;
          console.log('✅ Chrome AI (Gemini Nano) initialized successfully');
          return;
          
        } else if (capabilities.available === 'after-download') {
          console.log('📥 Chrome AI available after download, attempting to initialize...');
          try {
            this.aiSession = await self.ai.languageModel.create({
              systemPrompt: `You are an expert knowledge assistant that provides accurate, detailed explanations for any text. Your goal is to give users comprehensive understanding.

CORE PRINCIPLES:
- Always prioritize accuracy over brevity
- Provide context and real-world relevance
- Use clear, professional language
- Give practical examples when applicable
- Explain both simple and complex concepts thoroughly

RESPONSE FORMATS:
• Single words: Definition + context + usage examples
• Technical terms: Simple explanation + detailed breakdown + applications
• Phrases/idioms: Meaning + origin/context + usage scenarios  
• Sentences: Key points + concept explanations + significance
• Paragraphs: Summary + main concepts + detailed analysis
• Acronyms: Full form + meaning + context + usage examples
• Numbers/data: What it represents + context + significance
• URLs/emails: Format explanation + purpose + usage context

QUALITY STANDARDS:
- Be thorough but organized
- Include relevant background information
- Provide multiple perspectives when relevant
- Use examples that aid understanding
- Explain technical concepts in accessible terms
- Always aim to educate and inform comprehensively`
            });
            
            this.chromeAiAvailable = true;
            this.isInitialized = true;
            console.log('✅ Chrome AI initialized after download');
            return;
          } catch (downloadError) {
            console.log('❌ Chrome AI download/initialization failed:', downloadError.message);
          }
        } else {
          console.log('⚠️ Chrome AI not readily available, status:', capabilities.available);
        }
      } else {
        console.log('⚠️ Chrome AI API not found in this browser');
      }
    } catch (error) {
      console.log('❌ Chrome AI initialization error:', error.message);
    }
    
    // Continue initialization even if Chrome AI isn't available
    this.isInitialized = true;
    console.log('ℹ️ Background service initialized (Chrome AI status: ' + this.chromeAiAvailable + ')');
  }
  
  async initializeCustomModel() {
    try {
      // Try to load custom model from storage if available
      const loaded = await this.aiModelManager.loadModelFromStorage();
      if (loaded) {
        console.log('📋 Custom AI model loaded from storage');
      }
    } catch (error) {
      console.log('⚠️ Custom model initialization failed:', error.message);
    }
  }
  
  async handleModelDownload(progressCallback) {
    try {
      const result = await this.aiModelManager.downloadModel(progressCallback);
      return result;
    } catch (error) {
      console.error('Model download error:', error);
      return {
        success: false,
        error: error.message || 'Download failed'
      };
    }
  }
  
  async handleExplainText(text) {
    try {
      await this.initializeChromeAI();
      
      console.log(`🔍 Explaining text (${text.length} chars): "${text.substring(0, 50)}..."`);
      
      // PRIORITY 1: Use Chrome's built-in AI (Gemini Nano) - PRIMARY METHOD
      if (this.chromeAiAvailable && this.aiSession) {
        try {
          console.log('🚀 Using Chrome AI (Gemini Nano) for explanation...');
          
          // Create smart prompt based on text length and content
          let prompt = this.createIntelligentPrompt(text);
          
          const response = await this.aiSession.prompt(prompt);
          const cleanResponse = response.trim();
          
          if (cleanResponse && cleanResponse.length > 10) {
            console.log('✅ Chrome AI explanation successful');
            return {
              success: true,
              explanation: `${cleanResponse}\n\n*[Gemini Nano AI]*`,
              source: 'chrome-ai',
              model: 'Gemini Nano'
            };
          } else {
            console.log('⚠️ Chrome AI returned short/empty response, trying fallback');
          }
        } catch (chromeAiError) {
          console.log('❌ Chrome AI failed:', chromeAiError.message);
        }
      } else {
        console.log('⚠️ Chrome AI not available, using fallback');
      }
      
      // PRIORITY 2: Use custom model if available
      if (this.aiModelManager.isModelLoaded) {
        try {
          console.log('📋 Using Professional AI Model v4.0 for explanation...');
          const explanation = await this.aiModelManager.processText(text);
          return {
            success: true,
            explanation: explanation,
            source: 'custom-model',
            model: 'Professional AI Model v4.0'
          };
        } catch (modelError) {
          console.log('❌ Custom model failed:', modelError.message);
        }
      }
      
      // PRIORITY 3: Use enhanced fallback explanation service
      console.log('📚 Using enhanced fallback for explanation...');
      const explanation = await this.getEnhancedFallbackExplanation(text);
      return {
        success: true,
        explanation: explanation,
        source: 'fallback',
        model: 'Enhanced Dictionary'
      };
      
    } catch (error) {
      console.error('❌ Complete explanation failure:', error);
      return {
        success: false,
        error: 'All explanation methods failed. Please check your internet connection and try again.'
      };
    }
  }

  createIntelligentPrompt(text) {
    const wordCount = text.split(/\s+/).length;
    const hasSpecialChars = /[%$@#&]/.test(text);
    const isAllCaps = text === text.toUpperCase() && text.length > 1;
    const hasNumbers = /\d/.test(text);
    const isUrl = /^https?:\/\//.test(text);
    const isEmail = /\S+@\S+\.\S+/.test(text);
    
    let prompt = '';
    
    if (isUrl) {
      prompt = `Explain this URL and what type of website or resource it likely represents: "${text}"`;
    } else if (isEmail) {
      prompt = `Explain this email address format and provide context about email communication: "${text}"`;
    } else if (isAllCaps && wordCount <= 3) {
      prompt = `This appears to be an acronym: "${text}". Please provide the full meaning, explain what it stands for, and give context about its usage.`;
    } else if (hasNumbers && hasSpecialChars) {
      prompt = `Analyze and explain this text which contains numbers and special characters: "${text}". What does it represent?`;
    } else if (wordCount === 1) {
      prompt = `Provide a comprehensive explanation of the word "${text}". Include:
1. Definition and meaning
2. Context of usage
3. Examples if relevant
4. Any important related information`;
    } else if (wordCount <= 10) {
      prompt = `Explain this phrase or short text: "${text}". Provide the meaning, context, and any relevant background information.`;
    } else if (wordCount <= 50) {
      prompt = `Analyze and explain this passage: "${text}". Summarize the main points and explain key concepts.`;
    } else {
      prompt = `Please analyze this longer text: "${text}". 
Provide:
1. A clear summary of the main points
2. Explanation of key concepts
3. Context and significance of the content`;
    }
    
    return prompt;
  }
  
  async checkAIStatus() {
    const customModelStatus = this.aiModelManager.getModelStatus();
    let chromeAiStatus = {
      available: false,
      status: 'not-supported'
    };
    
    try {
      if (typeof self !== 'undefined' && 'ai' in self && 'languageModel' in self.ai) {
        const capabilities = await self.ai.languageModel.capabilities();
        chromeAiStatus = {
          available: capabilities.available === 'readily' || capabilities.available === 'after-download',
          status: capabilities.available,
          model: 'Gemini Nano',
          ready: this.chromeAiAvailable
        };
      }
    } catch (error) {
      chromeAiStatus = {
        available: false,
        status: 'error',
        error: error.message
      };
    }
    
    return {
      chromeAi: chromeAiStatus, // Primary
      customModel: {
        available: customModelStatus.isLoaded,
        isDownloading: customModelStatus.isDownloading,
        progress: customModelStatus.progress,
        name: customModelStatus.modelName,
        size: customModelStatus.modelSize,
        hasTransformers: customModelStatus.hasTransformers
      },
      fallback: {
        available: true,
        description: 'Enhanced dictionary with comprehensive explanations'
      },
      primarySource: chromeAiStatus.available && this.chromeAiAvailable ? 'chrome-ai' : 
                     customModelStatus.isLoaded ? 'custom-model' : 'fallback'
    };
  }
  
  async getEnhancedFallbackExplanation(text) {
    // Enhanced fallback with much better explanations
    const lowerText = text.toLowerCase().trim();
    
    // Comprehensive explanations dictionary
    const explanations = {
      // Technology & Programming
      'api': 'API (Application Programming Interface) is a set of protocols, routines, and tools that allows different software applications to communicate with each other. It defines how software components should interact and enables integration between different systems.',
      'algorithm': 'An algorithm is a step-by-step procedure or set of rules designed to solve a specific problem or perform a particular task. In computing, algorithms are used to process data, make calculations, and automate decision-making processes.',
      'artificial intelligence': 'Artificial Intelligence (AI) refers to computer systems that can perform tasks typically requiring human intelligence, such as learning, reasoning, problem-solving, and pattern recognition. AI includes machine learning, natural language processing, and computer vision.',
      'machine learning': 'Machine Learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. It uses algorithms to analyze data, identify patterns, and make predictions or decisions.',
      'blockchain': 'Blockchain is a distributed digital ledger technology that maintains a continuously growing list of records (blocks) that are linked and secured using cryptography. It\'s known for its use in cryptocurrencies but has many other applications in finance, supply chain, and data security.',
      'cloud computing': 'Cloud computing is the delivery of computing services (servers, storage, databases, networking, software) over the internet ("the cloud") to offer faster innovation, flexible resources, and economies of scale.',
      
      // Business & Finance
      'stakeholder': 'A stakeholder is any individual, group, or organization that can affect or is affected by a business\'s actions, objectives, and policies. This includes shareholders, employees, customers, suppliers, communities, and government entities.',
      'sustainability': 'Sustainability refers to meeting current needs without compromising the ability of future generations to meet their own needs. It involves balancing economic growth, environmental protection, and social equity.',
      'roi': 'ROI (Return on Investment) is a financial metric used to evaluate the efficiency or profitability of an investment. It measures the amount of return on an investment relative to the investment\'s cost, typically expressed as a percentage.',
      'scalability': 'Scalability is the ability of a system, process, or business to handle increased workload or expand in size while maintaining or improving performance. It\'s crucial for business growth and technology infrastructure.',
      
      // Science & Research
      'hypothesis': 'A hypothesis is a proposed explanation or educated guess for a phenomenon that can be tested through scientific investigation. It serves as a starting point for experiments and research studies.',
      'peer review': 'Peer review is the evaluation of scholarly work by experts in the same field before publication. It ensures quality, validity, and credibility of research by having knowledgeable peers assess the methodology, findings, and conclusions.',
      'methodology': 'Methodology refers to the systematic approach, techniques, and procedures used in research or analysis. It includes the theoretical framework, data collection methods, and analytical techniques employed in a study.',
      'empirical': 'Empirical refers to information or knowledge derived from observation, experience, or experimentation rather than theory or pure logic. Empirical evidence is based on actual data and measurable phenomena.',
      
      // General Academic
      'paradigm': 'A paradigm is a typical example, pattern, or model that serves as a framework for understanding concepts or approaching problems. In science, it refers to widely accepted theories and methods that define a field of study.',
      'synthesis': 'Synthesis is the process of combining different elements, ideas, or information to form a coherent whole or create something new. It involves integrating various sources to develop new insights or understanding.',
      'analysis': 'Analysis is the detailed examination and evaluation of something complex by separating it into its component parts. It involves studying relationships, patterns, and meanings to gain deeper understanding.'
    };
    
    // Check for exact matches first
    if (explanations[lowerText]) {
      return explanations[lowerText];
    }
    
    // Check for partial matches
    for (const [term, explanation] of Object.entries(explanations)) {
      if (lowerText.includes(term) || term.includes(lowerText)) {
        return explanation;
      }
    }
    
    // Pattern-based explanations
    if (text.match(/^\d+(\.\d+)?%$/)) {
      return `This is a percentage (${text}), representing a portion out of 100. Percentages are used to express ratios, rates, and proportions in a standardized format.`;
    }
    
    if (text.match(/^[A-Z]{2,}$/)) {
      return `"${text}" appears to be an acronym - a word formed from the initial letters of other words. Common examples include NASA (National Aeronautics and Space Administration) or FAQ (Frequently Asked Questions).`;
    }
    
    if (text.match(/^https?:\/\//)) {
      return `This is a URL (Uniform Resource Locator) - a web address that specifies the location of a resource on the internet. URLs begin with protocols like "http://" or "https://" and are used to access websites and web pages.`;
    }
    
    if (text.match(/\S+@\S+\.\S+/)) {
      return `This is an email address format, used for electronic mail communication. Email addresses consist of a username, followed by the "@" symbol, and then the domain name of the email provider.`;
    }
    
    if (text.match(/^\$[\d,]+(\.\d{2})?$/)) {
      return `This represents a monetary amount in US dollars. Currency symbols like "$" are used to denote specific currencies, and the format typically includes the amount with appropriate decimal places for cents.`;
    }
    
    // For longer passages, provide intelligent analysis instead of generic word counting
    const wordCount = text.split(/\s+/).length;
    
    if (wordCount > 50) {
      // Analyze content for meaningful summary
      const textLower = text.toLowerCase();
      
      if (textLower.includes('research') || textLower.includes('study') || textLower.includes('analysis')) {
        return 'This appears to be academic or research content, likely discussing methodology, findings, or analysis in a particular field of study.';
      }
      
      if (textLower.includes('business') || textLower.includes('company') || textLower.includes('market')) {
        return 'This text discusses business or economic topics, covering commercial activities, market dynamics, or business strategies.';
      }
      
      if (textLower.includes('technology') || textLower.includes('digital') || textLower.includes('computer')) {
        return 'This text covers technology-related concepts, discussing digital innovations, computing systems, or technological applications.';
      }
      
      if (textLower.includes('climate') || textLower.includes('environment') || textLower.includes('sustainability')) {
        return 'This text addresses environmental topics, likely covering climate change, environmental protection, or sustainability practices.';
      }
      
      return 'This text presents information or analysis on a specific topic, providing detailed explanation or discussion of its subject matter.';
    }
    
    if (text.includes('?')) {
      return `This text contains a question, which is used to request information, seek clarification, or encourage discussion about a topic.`;
    }
    
    if (text.match(/^[A-Z][a-z]+ [A-Z][a-z]+$/)) {
      return `This appears to be a proper name, which refers to a specific individual, place, organization, or branded item.`;
    }
    
    // Default explanation without generic template
    return `This text appears to be a specialized term, phrase, or content that may have specific meaning within its particular context or field of use.`;
  }
}

// Initialize the background service
const explaniumService = new ExplaniumBackgroundService(); 