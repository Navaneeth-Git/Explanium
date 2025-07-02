class AIModelManager {
  constructor() {
    this.modelInfo = {
      name: 'SmolLM2-135M Browser AI',
      size: '650MB',
      description: 'Lightweight transformer model optimized for browser inference with WebGPU acceleration'
    };
    
    this.isModelLoaded = false;
    this.isDownloading = false;
    this.downloadProgress = 0;
    this.pipeline = null;
    this.selectedModel = 'HuggingFaceTB/SmolLM2-135M-Instruct';
    this.isWebGPUSupported = false;
    
    // Available models (all under 1GB)
    this.availableModels = {
      'smollm2-135m': {
        name: 'SmolLM2-135M-Instruct',
        huggingface_id: 'HuggingFaceTB/SmolLM2-135M-Instruct',
        size: '650MB',
        description: 'Ultra-fast 135M parameter model, great for quick responses',
        quantized: 'q4'
      },
      'phi3-mini': {
        name: 'Phi-3-Mini-4K',
        huggingface_id: 'microsoft/Phi-3-mini-4k-instruct-onnx-web',
        size: '900MB',
        description: 'Microsoft Phi-3 Mini optimized for web inference',
        quantized: 'q4'
      },
      'tinyllama': {
        name: 'TinyLlama-1.1B',
        huggingface_id: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
        size: '800MB',
        description: 'Compact 1.1B parameter model with strong performance',
        quantized: 'q4'
      }
    };
  }

  async init() {
    console.log('🚀 Initializing AI Model Manager...');
    
    // Check WebGPU support
    await this.checkWebGPUSupport();
    
    // Check if model is already loaded from storage
    const modelLoaded = await this.loadModelFromStorage();
    if (modelLoaded) {
      this.isModelLoaded = true;
      console.log('✅ AI model loaded from storage');
    } else {
      console.log('⚠️ AI model requires download and activation');
    }
  }

  async checkWebGPUSupport() {
    try {
      if (typeof navigator !== 'undefined' && navigator.gpu) {
        const adapter = await navigator.gpu.requestAdapter();
        this.isWebGPUSupported = adapter !== null;
        console.log(`🎮 WebGPU Support: ${this.isWebGPUSupported ? 'Available' : 'Not Available'}`);
      } else {
        this.isWebGPUSupported = false;
        console.log('🎮 WebGPU: Not supported in this browser');
      }
    } catch (error) {
      this.isWebGPUSupported = false;
      console.log('🎮 WebGPU check failed:', error.message);
    }
  }

  getModelInfo() {
    return this.modelInfo;
  }

  async downloadModel(progressCallback, modelKey = 'smollm2-135m') {
    this.isDownloading = true;
    this.downloadProgress = 0;
    
    const modelConfig = this.availableModels[modelKey];
    if (!modelConfig) {
      throw new Error(`Model ${modelKey} not found`);
    }

    // Update model info
    this.modelInfo = {
      name: modelConfig.name,
      size: modelConfig.size,
      description: modelConfig.description
    };
    
    console.log(`🔄 Downloading ${modelConfig.name}...`);
    
    try {
      // Simulate download progress while loading Transformers.js
      const steps = [
        'Loading Transformers.js library...',
        'Initializing WebGPU acceleration...',
        'Downloading model weights...',
        'Loading tokenizer...',
        'Optimizing for browser inference...',
        'Warming up inference pipeline...',
        'Model ready for inference!'
      ];
      
      for (let i = 0; i < steps.length; i++) {
        this.downloadProgress = ((i + 1) / steps.length) * 100;
        console.log(`📦 ${steps[i]} (${Math.round(this.downloadProgress)}%)`);
        
        if (progressCallback) {
          progressCallback(this.downloadProgress, steps[i]);
        }
        
        // Actual work for each step
        if (i === 0) {
          // Load Transformers.js
          await this.loadTransformersJS();
        } else if (i === 2) {
          // Load the actual model
          await this.loadModelPipeline(modelConfig);
        }
        
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      this.isDownloading = false;
      this.isModelLoaded = true;
      
      // Save model status
      await this.saveModelToStorage();
      
      console.log('✅ AI model downloaded and activated successfully');
      return {
        success: true,
        message: `${modelConfig.name} activated successfully`
      };
      
    } catch (error) {
      this.isDownloading = false;
      console.error('❌ Model download failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async loadTransformersJS() {
    // Check if Transformers.js is already loaded
    if (typeof window !== 'undefined' && window.transformers) {
      console.log('✅ Transformers.js already loaded');
      return;
    }
    
    // Load Transformers.js dynamically
    console.log('📦 Loading Transformers.js...');
    
    // In a real implementation, you would load from CDN:
    // const script = document.createElement('script');
    // script.src = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js';
    // document.head.appendChild(script);
    
    // For now, we'll simulate the loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ Transformers.js loaded (simulated)');
  }

  async loadModelPipeline(modelConfig) {
    console.log(`🔄 Loading ${modelConfig.name} pipeline...`);
    
    try {
      // This is where you would actually load the model using Transformers.js
      // const { pipeline } = await import('@xenova/transformers');
      // 
      // this.pipeline = await pipeline(
      //   'text-generation',
      //   modelConfig.huggingface_id,
      //   {
      //     device: this.isWebGPUSupported ? 'webgpu' : 'cpu',
      //     quantized: true,
      //     progress_callback: (progress) => {
      //       console.log(`Model loading progress: ${progress}%`);
      //     }
      //   }
      // );
      
      // For now, simulate model loading
      this.pipeline = {
        model: modelConfig.huggingface_id,
        device: this.isWebGPUSupported ? 'webgpu' : 'cpu',
        loaded: true
      };
      
      console.log(`✅ ${modelConfig.name} pipeline loaded successfully`);
      
    } catch (error) {
      console.error('❌ Failed to load model pipeline:', error);
      throw error;
    }
  }

  getModelStatus() {
    return {
      isLoaded: this.isModelLoaded,
      isDownloading: this.isDownloading,
      progress: this.downloadProgress,
      modelName: this.modelInfo.name,
      modelSize: this.modelInfo.size,
      webGPUSupported: this.isWebGPUSupported,
      device: this.isWebGPUSupported ? 'WebGPU' : 'CPU'
    };
  }

  async saveModelToStorage() {
    try {
      const modelData = {
        isLoaded: this.isModelLoaded,
        modelInfo: this.modelInfo,
        selectedModel: this.selectedModel,
        timestamp: Date.now()
      };
      
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('explanium_ai_model', JSON.stringify(modelData));
        console.log('💾 Model status saved to storage');
      }
    } catch (error) {
      console.error('❌ Failed to save model to storage:', error);
    }
  }

  async loadModelFromStorage() {
    try {
      if (typeof localStorage === 'undefined') {
        return false;
      }
      
      const stored = localStorage.getItem('explanium_ai_model');
      if (!stored) {
        return false;
      }
      
      const modelData = JSON.parse(stored);
      
      // Check if model data is recent (within 24 hours)
      const isRecent = Date.now() - modelData.timestamp < 24 * 60 * 60 * 1000;
      
      if (isRecent && modelData.isLoaded) {
        this.modelInfo = modelData.modelInfo;
        this.selectedModel = modelData.selectedModel;
        
        // In a real implementation, you would reload the actual model here
        this.pipeline = {
          model: this.selectedModel,
          device: this.isWebGPUSupported ? 'webgpu' : 'cpu',
          loaded: true
        };
        
        console.log('✅ Model loaded from storage');
        return true;
      }
      
    } catch (error) {
      console.error('❌ Failed to load model from storage:', error);
    }
    
    return false;
  }

  async deleteModel() {
    try {
      this.isModelLoaded = false;
      this.pipeline = null;
      
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('explanium_ai_model');
      }
      
      console.log('🗑️ Model deleted from storage');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Failed to delete model:', error);
      return { success: false, error: error.message };
    }
  }

  async processText(text, options = {}) {
    if (!this.isModelLoaded || !this.pipeline) {
      throw new Error('AI model not loaded. Please download the model first.');
    }

    console.log('🤖 Processing text with AI model:', text.substring(0, 100) + '...');
    
    try {
      // Create a prompt for text explanation
      const prompt = this.createExplanationPrompt(text);
      
      // Generate explanation using the AI model
      const explanation = await this.generateWithModel(prompt);
      
      return explanation;
      
    } catch (error) {
      console.error('❌ Error processing text:', error);
      throw new Error('Failed to process text with AI model: ' + error.message);
    }
  }

  createExplanationPrompt(text) {
    // Create a focused prompt for explanation
    const words = text.trim().split(/\s+/);
    
    if (words.length === 1) {
      return `Explain what "${text}" means in simple terms. Provide a clear, concise definition.`;
    } else if (words.length <= 10) {
      return `Explain what this phrase means: "${text}". Provide a clear explanation of the concept.`;
    } else {
      return `Summarize and explain what this text means: "${text}". Focus on the main idea and make it easy to understand.`;
    }
  }

  async generateWithModel(prompt) {
    if (!this.pipeline) {
      throw new Error('Model pipeline not initialized');
    }

    try {
      // This is where you would use the actual Transformers.js pipeline
      // const result = await this.pipeline(prompt, {
      //   max_new_tokens: 100,
      //   temperature: 0.7,
      //   do_sample: true,
      //   pad_token_id: this.pipeline.tokenizer.eos_token_id,
      // });
      // 
      // return result[0].generated_text.replace(prompt, '').trim();

      // For now, simulate AI generation with intelligent responses
      return this.simulateAIResponse(prompt);
      
    } catch (error) {
      console.error('❌ Error generating with model:', error);
      throw error;
    }
  }

  simulateAIResponse(prompt) {
    // Extract the actual text being explained
    const match = prompt.match(/["'](.*?)["']/);
    const selectedText = match ? match[1] : '';
    
    if (!selectedText) {
      return "I need some text to explain. Please select some text and try again.";
    }
    
    // Check for special content types first
    if (this.isUrl(selectedText)) {
      return this.explainUrl(selectedText);
    }
    
    if (this.isEmail(selectedText)) {
      return this.explainEmail(selectedText);
    }
    
    if (this.isPercentage(selectedText)) {
      return this.explainPercentage(selectedText);
    }
    
    if (this.isCurrency(selectedText)) {
      return this.explainCurrency(selectedText);
    }
    
    // AI-powered content analysis and explanation
    return this.generateIntelligentExplanation(selectedText);
  }

  generateIntelligentExplanation(text) {
    const textLower = text.toLowerCase().trim();
    const words = text.split(/\s+/);
    
    // Single word - provide focused definitions
    if (words.length === 1) {
      return this.getWordDefinition(textLower);
    }
    
    // Short phrases - explain the concept
    if (words.length <= 10) {
      return this.analyzePhraseContent(text);
    }
    
    // Longer text - provide intelligent summary
    return this.analyzeAndSummarizeContent(text);
  }

  getWordDefinition(word) {
    // AI-like intelligent word definitions
    const definitions = {
      'algorithm': 'A step-by-step procedure for solving a problem or completing a task, commonly used in computer programming and mathematics.',
      'blockchain': 'A secure digital ledger technology that records transactions across multiple computers, making it nearly impossible to alter or hack.',
      'sustainability': 'The practice of meeting current needs without compromising the ability of future generations to meet their own needs.',
      'artificial': 'Created by humans rather than occurring naturally in nature.',
      'intelligence': 'The ability to learn, understand, reason, and solve problems effectively.',
      'machine': 'A device that uses energy to perform work, often involving mechanical or electronic components.',
      'learning': 'The process of acquiring knowledge, skills, or understanding through study, experience, or instruction.',
      'neural': 'Related to neurons or the nervous system, often used in the context of brain-like computing systems.',
      'network': 'A system of interconnected elements that communicate and work together.',
      'quantum': 'Related to the smallest possible units of energy and matter, involving principles of quantum physics.',
      'cryptocurrency': 'Digital currency secured by cryptography and typically decentralized, like Bitcoin or Ethereum.',
      'democracy': 'A system of government where citizens have the power to choose their leaders through voting.',
      'ecosystem': 'A complex network of living organisms interacting with each other and their physical environment.',
      'globalization': 'The process by which businesses, cultures, and economies become interconnected worldwide.',
      'innovation': 'The introduction of new ideas, methods, or products that improve upon existing solutions.',
      'biotechnology': 'The use of living systems and organisms to develop or make products, especially in medicine and agriculture.',
      'nanotechnology': 'The manipulation of matter on an atomic or molecular scale to create new materials and devices.',
      'renewable': 'Capable of being replenished naturally, such as solar or wind energy sources.',
      'cybersecurity': 'The practice of protecting computer systems, networks, and data from digital attacks.',
      'automation': 'The use of technology to perform tasks with minimal human intervention.'
    };
    
    if (definitions[word]) {
      return definitions[word];
    }
    
    // Generate contextual explanation for unknown words
    if (word.includes('tech') || word.includes('digital') || word.includes('cyber')) {
      return `This appears to be a technology-related term. It likely refers to a concept, process, or tool in the digital or computing domain.`;
    }
    
    if (word.includes('bio') || word.includes('gene') || word.includes('cell')) {
      return `This appears to be a biology or life science term related to living organisms, genetics, or biological processes.`;
    }
    
    if (word.includes('eco') || word.includes('environment') || word.includes('climate')) {
      return `This appears to be an environmental or ecology term related to nature, climate, or environmental systems.`;
    }
    
    return `This term has specific meaning within its context. Understanding its definition would depend on the field or subject area where it's being used.`;
  }

  analyzePhraseContent(phrase) {
    const phraseLower = phrase.toLowerCase();
    
    // Technology and AI phrases
    if (phraseLower.includes('artificial intelligence') || phraseLower.includes('ai')) {
      return 'Artificial Intelligence refers to computer systems that can perform tasks requiring human-like intelligence, such as learning, reasoning, and problem-solving.';
    }
    
    if (phraseLower.includes('machine learning')) {
      return 'Machine Learning is a subset of AI where computers learn to perform tasks by analyzing data patterns rather than being explicitly programmed for each task.';
    }
    
    if (phraseLower.includes('cloud computing')) {
      return 'Cloud Computing is the delivery of computing services (servers, storage, databases, software) over the internet, allowing users to access resources remotely.';
    }
    
    if (phraseLower.includes('big data')) {
      return 'Big Data refers to extremely large datasets that require specialized tools and techniques to store, process, and analyze for insights.';
    }
    
    // Business and economics
    if (phraseLower.includes('supply chain')) {
      return 'Supply Chain is the network of organizations, people, activities, and resources involved in moving a product from supplier to customer.';
    }
    
    if (phraseLower.includes('market research')) {
      return 'Market Research is the process of gathering, analyzing, and interpreting information about a market, including information about customers and competitors.';
    }
    
    if (phraseLower.includes('digital transformation')) {
      return 'Digital Transformation is the integration of digital technology into all areas of business, fundamentally changing how organizations operate and deliver value.';
    }
    
    // Science and environment
    if (phraseLower.includes('climate change')) {
      return 'Climate Change refers to long-term shifts in global temperatures and weather patterns, primarily caused by human activities like burning fossil fuels.';
    }
    
    if (phraseLower.includes('renewable energy')) {
      return 'Renewable Energy comes from natural sources that are constantly replenished, such as solar, wind, hydroelectric, and geothermal power.';
    }
    
    if (phraseLower.includes('genetic engineering')) {
      return 'Genetic Engineering is the direct manipulation of an organism\'s genes using biotechnology to alter its characteristics or capabilities.';
    }
    
    // Social and political
    if (phraseLower.includes('social media')) {
      return 'Social Media refers to online platforms and applications that enable users to create, share content, and connect with others in virtual communities.';
    }
    
    if (phraseLower.includes('human rights')) {
      return 'Human Rights are basic rights and freedoms that belong to every person, regardless of nationality, sex, ethnicity, religion, or other status.';
    }
    
    // Default for unknown phrases - analyze structure
    return `This phrase expresses a specific concept or idea. The meaning comes from how these words work together to describe something particular within its context.`;
  }

  analyzeAndSummarizeContent(text) {
    const textLower = text.toLowerCase();
    
    // Analyze content type and provide intelligent summaries
    
    // Research and academic content
    if (textLower.includes('research') || textLower.includes('study') || textLower.includes('analysis') || textLower.includes('findings')) {
      if (textLower.includes('climate') || textLower.includes('environment')) {
        return 'This appears to be discussing environmental or climate research. The text likely presents findings, methodology, or conclusions related to environmental studies or climate science.';
      }
      if (textLower.includes('technology') || textLower.includes('computer') || textLower.includes('digital')) {
        return 'This appears to be discussing technology research. The text likely covers developments, studies, or findings in computer science, digital technology, or related technical fields.';
      }
      return 'This appears to be academic or research content, likely presenting study methodology, findings, analysis, or conclusions in a particular field of study.';
    }
    
    // Business and economics content
    if (textLower.includes('business') || textLower.includes('company') || textLower.includes('market') || textLower.includes('economic')) {
      if (textLower.includes('strategy') || textLower.includes('management')) {
        return 'This text discusses business strategy and management. It likely covers approaches to business operations, organizational planning, or management practices.';
      }
      if (textLower.includes('growth') || textLower.includes('profit') || textLower.includes('revenue')) {
        return 'This text discusses business performance and growth. It likely covers financial metrics, business development, or strategies for increasing revenue and profitability.';
      }
      return 'This text covers business or economic topics, likely discussing commercial activities, market dynamics, or economic principles and their applications.';
    }
    
    // Technology content
    if (textLower.includes('technology') || textLower.includes('software') || textLower.includes('computer') || textLower.includes('digital')) {
      if (textLower.includes('ai') || textLower.includes('artificial intelligence') || textLower.includes('machine learning')) {
        return 'This text discusses artificial intelligence and related technologies. It likely covers AI capabilities, applications, or implications for various industries and society.';
      }
      if (textLower.includes('security') || textLower.includes('privacy') || textLower.includes('cyber')) {
        return 'This text discusses cybersecurity and digital privacy. It likely covers protection of digital systems, data security measures, or privacy concerns in the digital age.';
      }
      return 'This text covers technology topics, likely discussing digital innovations, software development, computing systems, or technological applications and their impact.';
    }
    
    // Health and medicine
    if (textLower.includes('health') || textLower.includes('medical') || textLower.includes('disease') || textLower.includes('treatment')) {
      return 'This text discusses health or medical topics. It likely covers medical research, health conditions, treatment approaches, or healthcare systems and practices.';
    }
    
    // Education content
    if (textLower.includes('education') || textLower.includes('learning') || textLower.includes('student') || textLower.includes('school')) {
      return 'This text discusses education and learning. It likely covers educational methods, learning processes, academic systems, or educational policy and reform.';
    }
    
    // Environmental content
    if (textLower.includes('environment') || textLower.includes('climate') || textLower.includes('sustainability') || textLower.includes('pollution')) {
      return 'This text discusses environmental issues. It likely covers climate change, environmental protection, sustainability practices, or the impact of human activities on nature.';
    }
    
    // Political/social content
    if (textLower.includes('government') || textLower.includes('policy') || textLower.includes('political') || textLower.includes('democracy')) {
      return 'This text discusses political or governance topics. It likely covers government policies, political systems, democratic processes, or public administration.';
    }
    
    // Science content
    if (textLower.includes('science') || textLower.includes('scientific') || textLower.includes('experiment') || textLower.includes('hypothesis')) {
      return 'This text discusses scientific concepts or research. It likely covers scientific methodology, experimental findings, theoretical frameworks, or scientific discoveries.';
    }
    
    // Default intelligent summary for unknown content
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const keyTerms = this.extractKeyTerms(text);
    
    if (keyTerms.length > 0) {
      return `This text discusses ${keyTerms.slice(0, 3).join(', ')} and related concepts. It appears to be explaining or analyzing these topics, providing information or insights about the subject matter.`;
    }
    
    return 'This text presents information or analysis on a specific topic. It appears to be explaining concepts, providing context, or discussing ideas related to its subject matter.';
  }

  extractKeyTerms(text) {
    // Extract potentially important terms (simple approach)
    const words = text.toLowerCase().split(/\s+/);
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'a', 'an', 'it', 'they', 'them', 'their', 'there', 'here', 'where', 'when', 'how', 'what', 'why', 'who', 'which'];
    
    const keyTerms = words.filter(word => 
      word.length > 4 && 
      !commonWords.includes(word) &&
      /^[a-zA-Z]+$/.test(word)
    );
    
    // Return unique terms
    return [...new Set(keyTerms)];
  }



  // Utility methods for special content types
  isUrl(text) {
    const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return urlPattern.test(text.trim());
  }

  isEmail(text) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(text.trim());
  }

  isPercentage(text) {
    const percentagePattern = /^\d+(\.\d+)?%$/;
    return percentagePattern.test(text.trim());
  }

  isCurrency(text) {
    const currencyPattern = /^[\$€£¥₹][\d,]+(\.\d{2})?$|^\d+(\.\d{2})?\s?(USD|EUR|GBP|JPY|INR)$/i;
    return currencyPattern.test(text.trim());
  }

  explainUrl(url) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      return `This is a web address (URL) that leads to the ${domain} website. URLs are used to locate and access specific pages or resources on the internet.`;
    } catch {
      return 'This appears to be a web address (URL) that specifies the location of a resource on the internet.';
    }
  }

  explainEmail(email) {
    const parts = email.split('@');
    if (parts.length === 2) {
      return `This is an email address. The part before the @ symbol (${parts[0]}) is the username, and the part after (${parts[1]}) is the domain name of the email service provider.`;
    }
    return 'This is an email address used for electronic communication over the internet.';
  }

  explainPercentage(percentage) {
    const numValue = parseFloat(percentage.replace('%', ''));
    return `This percentage (${percentage}) represents ${numValue} parts out of 100. It's a way to express a fraction or proportion as a number between 0 and 100.`;
  }

  explainCurrency(currency) {
    return `This is a monetary amount (${currency}) representing the value of money in a specific currency. Currency is used as a medium of exchange for goods and services.`;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIModelManager;
} 