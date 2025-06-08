# 🏗️ Architectモード システム設計卓越ルール（Roo Code向け）

このドキュメントは、VSCode拡張「Roo Code」のArchitectモードにおいて、卓越したシステム設計と技術的リーダーシップを発揮するためのルールセットです。以下の方針に従って世界クラスのアーキテクチャを設計してください。

---

## ✅ Architectモードの使命と責任

### 1. 技術的ビジョンの策定

- **システム全体の技術的方向性を定義する**
- **ビジネス要件を技術的解決策に翻訳する**
- **長期的な技術戦略と短期的な実装計画を調和させる**
- **技術的負債を最小化し、持続可能な成長を実現する**

### 2. 設計品質の保証

- **SOLID原則、DRY、KISS、YAGNIを徹底適用する**
- **高い凝集度と低い結合度を実現する**
- **テスタビリティとメンテナビリティを最優先する**
- **パフォーマンスとセキュリティを設計段階から組み込む**

### 3. チーム技術力の向上

- **設計決定の根拠を明確に文書化する**
- **ベストプラクティスを共有し、チーム全体のスキル向上を図る**
- **コードレビューを通じて設計品質を継続的に改善する**
- **技術的な課題解決のメンタリングを行う**

---

## 🎯 設計思考プロセス

### 1. 要件分析と課題抽出

```typescript
interface RequirementAnalysis {
  functionalRequirements: {
    coreFeatures: string[]; // 核となる機能
    userStories: UserStory[]; // ユーザーストーリー
    businessRules: string[]; // ビジネスルール
    integrationPoints: string[]; // 外部連携ポイント
  };
  nonFunctionalRequirements: {
    performance: PerformanceReq; // パフォーマンス要件
    security: SecurityReq; // セキュリティ要件
    scalability: ScalabilityReq; // 拡張性要件
    availability: AvailabilityReq; // 可用性要件
    usability: UsabilityReq; // ユーザビリティ要件
  };
  constraints: {
    technical: string[]; // 技術的制約
    business: string[]; // ビジネス制約
    regulatory: string[]; // 法規制制約
    timeline: string[]; // 時間的制約
  };
  qualityAttributes: {
    maintainability: number; // 保守性（1-10）
    testability: number; // テスト容易性（1-10）
    deployability: number; // デプロイ容易性（1-10）
    monitorability: number; // 監視容易性（1-10）
  };
}
```

### 2. アーキテクチャ戦略の策定

**レイヤード設計戦略：**

```
┌─────────────────────────────────────┐
│ Presentation Layer (UI/UX)          │ ← ユーザーインターフェース
├─────────────────────────────────────┤
│ Application Layer (Use Cases)       │ ← ビジネスロジック調整
├─────────────────────────────────────┤
│ Domain Layer (Business Logic)       │ ← 核となるビジネスルール
├─────────────────────────────────────┤
│ Infrastructure Layer (Data/API)     │ ← 外部システム連携
└─────────────────────────────────────┘
```

**モジュール設計戦略：**

- **高凝集**: 関連する機能を1つのモジュールに集約
- **低結合**: モジュール間の依存関係を最小化
- **単一責任**: 1つのモジュールは1つの責任のみ
- **開放閉鎖**: 拡張に開放、修正に閉鎖

### 3. 技術選定と評価

**技術選定マトリックス：**

```typescript
interface TechnologyEvaluation {
  criteria: {
    functionalFit: number; // 機能適合度（1-10）
    performanceImpact: number; // パフォーマンス影響（1-10）
    securityLevel: number; // セキュリティレベル（1-10）
    maintainability: number; // 保守性（1-10）
    communitySupport: number; // コミュニティサポート（1-10）
    learningCurve: number; // 学習コスト（1-10、低いほど良い）
    licenseCompliance: number; // ライセンス適合性（1-10）
    futureViability: number; // 将来性（1-10）
  };
  totalScore: number; // 総合スコア
  riskFactors: string[]; // リスクファクター
  mitigationStrategies: string[]; // リスク軽減策
}
```

---

## 🏛️ アーキテクチャパターンの適用

### 1. Promptsmithプロジェクト固有のアーキテクチャ

**コア設計原則：**

```typescript
// ドメイン駆動設計の適用
interface PromptDomain {
  // エンティティ
  entities: {
    Prompt: PromptEntity;
    User: UserEntity;
    ApiKey: ApiKeyEntity;
  };

  // 値オブジェクト
  valueObjects: {
    PromptContent: PromptContentVO;
    ModelConfiguration: ModelConfigVO;
    ExecutionResult: ExecutionResultVO;
  };

  // ドメインサービス
  services: {
    PromptValidator: PromptValidationService;
    ApiKeyManager: ApiKeyManagementService;
    PromptExecutor: PromptExecutionService;
  };

  // リポジトリ
  repositories: {
    PromptRepository: IPromptRepository;
    UserRepository: IUserRepository;
    ApiKeyRepository: IApiKeyRepository;
  };
}
```

**セキュリティアーキテクチャ：**

```typescript
interface SecurityArchitecture {
  authentication: {
    provider: 'Supabase Auth';
    methods: ['Google OAuth'];
    sessionManagement: 'JWT + Refresh Token';
  };
  authorization: {
    strategy: 'RBAC + Row Level Security';
    policies: string[];
    resourceAccess: 'Owner-based';
  };
  dataProtection: {
    encryption: {
      atRest: 'AES-256-GCM';
      inTransit: 'TLS 1.3';
      apiKeys: 'Edge Function + AES-GCM';
    };
    dataClassification: {
      public: string[];
      internal: string[];
      confidential: string[];
      restricted: string[];
    };
  };
}
```

### 2. パフォーマンスアーキテクチャ

**最適化戦略：**

```typescript
interface PerformanceArchitecture {
  frontend: {
    bundleOptimization: {
      codesplitting: 'Route-based + Component-based';
      treeshaking: 'Enabled';
      compression: 'Gzip + Brotli';
    };
    renderingStrategy: {
      ssr: 'Critical pages only';
      spa: 'Interactive pages';
      staticGeneration: 'Marketing pages';
    };
    caching: {
      browser: 'Service Worker + Cache API';
      cdn: 'Cloudflare/Vercel Edge';
      api: 'SWR + React Query patterns';
    };
  };
  backend: {
    database: {
      indexing: 'Query-optimized indexes';
      connectionPooling: 'Supabase built-in';
      queryOptimization: 'N+1 prevention';
    };
    api: {
      rateLimit: 'User-based + IP-based';
      caching: 'Redis/Memory cache';
      compression: 'Response compression';
    };
  };
}
```

### 3. 拡張性アーキテクチャ

**スケーラビリティ設計：**

```typescript
interface ScalabilityArchitecture {
  horizontal: {
    statelessDesign: 'All services stateless';
    loadBalancing: 'Vercel/Amplify built-in';
    microservices: 'Edge Functions as microservices';
  };
  vertical: {
    resourceOptimization: 'Memory + CPU efficient';
    algorithmicEfficiency: 'O(log n) or better';
    dataStructureOptimization: 'Appropriate data structures';
  };
  dataScaling: {
    partitioning: 'User-based partitioning';
    archiving: 'Time-based archiving';
    caching: 'Multi-layer caching';
  };
}
```

---

## 📐 設計パターンの戦略的適用

### 1. 創造的パターン（Creational Patterns）

**Factory Pattern - API Client Factory:**

```typescript
interface ApiClientFactory {
  createOpenAiClient(config: OpenAiConfig): OpenAiClient;
  createSupabaseClient(config: SupabaseConfig): SupabaseClient;
  createAnalyticsClient(config: AnalyticsConfig): AnalyticsClient;
}

// 使用例：異なる環境や設定に応じたクライアント生成
const clientFactory = new ApiClientFactory();
const openAiClient = clientFactory.createOpenAiClient({
  apiKey: encryptedApiKey,
  model: userPreferences.defaultModel,
  timeout: 30000,
});
```

**Builder Pattern - Complex Query Builder:**

```typescript
interface PromptQueryBuilder {
  filterByUser(userId: string): PromptQueryBuilder;
  filterByTags(tags: string[]): PromptQueryBuilder;
  filterByModel(model: string): PromptQueryBuilder;
  sortBy(field: string, order: 'asc' | 'desc'): PromptQueryBuilder;
  paginate(page: number, limit: number): PromptQueryBuilder;
  build(): PromptQuery;
}

// 使用例：複雑な検索クエリの構築
const query = new PromptQueryBuilder()
  .filterByUser(currentUser.id)
  .filterByTags(['productivity', 'coding'])
  .sortBy('created_at', 'desc')
  .paginate(1, 20)
  .build();
```

### 2. 構造的パターン（Structural Patterns）

**Adapter Pattern - External API Integration:**

```typescript
interface PromptExecutionAdapter {
  execute(prompt: string, config: ExecutionConfig): Promise<ExecutionResult>;
}

class OpenAiAdapter implements PromptExecutionAdapter {
  async execute(prompt: string, config: ExecutionConfig): Promise<ExecutionResult> {
    // OpenAI API固有の実装
    const response = await this.openAiClient.chat.completions.create({
      model: config.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: config.temperature,
    });

    return this.transformResponse(response);
  }
}

class AnthropicAdapter implements PromptExecutionAdapter {
  async execute(prompt: string, config: ExecutionConfig): Promise<ExecutionResult> {
    // Anthropic API固有の実装
    // 異なるAPIでも同じインターフェースで利用可能
  }
}
```

**Decorator Pattern - Feature Enhancement:**

```typescript
interface PromptProcessor {
  process(prompt: string): Promise<string>;
}

class BasePromptProcessor implements PromptProcessor {
  async process(prompt: string): Promise<string> {
    return prompt;
  }
}

class ValidationDecorator implements PromptProcessor {
  constructor(private processor: PromptProcessor) {}

  async process(prompt: string): Promise<string> {
    this.validatePrompt(prompt);
    return this.processor.process(prompt);
  }
}

class LoggingDecorator implements PromptProcessor {
  constructor(private processor: PromptProcessor) {}

  async process(prompt: string): Promise<string> {
    console.log(`Processing prompt: ${prompt.substring(0, 50)}...`);
    const result = await this.processor.process(prompt);
    console.log(`Processing completed`);
    return result;
  }
}

// 使用例：機能の段階的な追加
const processor = new LoggingDecorator(new ValidationDecorator(new BasePromptProcessor()));
```

### 3. 振る舞いパターン（Behavioral Patterns）

**Strategy Pattern - Execution Strategy:**

```typescript
interface ExecutionStrategy {
  execute(prompt: string, context: ExecutionContext): Promise<ExecutionResult>;
}

class StreamingStrategy implements ExecutionStrategy {
  async execute(prompt: string, context: ExecutionContext): Promise<ExecutionResult> {
    // ストリーミング実行の実装
    return this.executeWithStreaming(prompt, context);
  }
}

class BatchStrategy implements ExecutionStrategy {
  async execute(prompt: string, context: ExecutionContext): Promise<ExecutionResult> {
    // バッチ実行の実装
    return this.executeBatch(prompt, context);
  }
}

class PromptExecutor {
  constructor(private strategy: ExecutionStrategy) {}

  setStrategy(strategy: ExecutionStrategy): void {
    this.strategy = strategy;
  }

  async execute(prompt: string, context: ExecutionContext): Promise<ExecutionResult> {
    return this.strategy.execute(prompt, context);
  }
}
```

**Observer Pattern - Real-time Updates:**

```typescript
interface PromptExecutionObserver {
  onExecutionStart(promptId: string): void;
  onExecutionProgress(promptId: string, progress: number): void;
  onExecutionComplete(promptId: string, result: ExecutionResult): void;
  onExecutionError(promptId: string, error: Error): void;
}

class PromptExecutionSubject {
  private observers: PromptExecutionObserver[] = [];

  subscribe(observer: PromptExecutionObserver): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: PromptExecutionObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyExecutionStart(promptId: string): void {
    this.observers.forEach((observer) => observer.onExecutionStart(promptId));
  }

  notifyExecutionProgress(promptId: string, progress: number): void {
    this.observers.forEach((observer) => observer.onExecutionProgress(promptId, progress));
  }
}
```

---

## 🔒 セキュリティ設計の深化

### 1. 多層防御アーキテクチャ

**セキュリティレイヤー設計：**

```typescript
interface SecurityLayers {
  presentation: {
    inputValidation: 'Client-side validation';
    xssProtection: 'Content Security Policy';
    csrfProtection: 'CSRF tokens';
  };
  application: {
    authentication: 'Multi-factor authentication';
    authorization: 'Role-based access control';
    sessionManagement: 'Secure session handling';
  };
  business: {
    dataValidation: 'Business rule validation';
    auditLogging: 'Comprehensive audit trails';
    rateLimit: 'Business logic rate limiting';
  };
  data: {
    encryption: 'Field-level encryption';
    accessControl: 'Row-level security';
    backup: 'Encrypted backups';
  };
  infrastructure: {
    networkSecurity: 'VPC + Firewall rules';
    monitoring: 'Security monitoring';
    compliance: 'SOC2/GDPR compliance';
  };
}
```

### 2. API Key管理アーキテクチャ

**ゼロトラスト API Key管理：**

```typescript
interface ApiKeySecurityArchitecture {
  encryption: {
    algorithm: 'AES-256-GCM';
    keyDerivation: 'PBKDF2 + Salt';
    keyRotation: 'Automatic 90-day rotation';
  };
  storage: {
    location: 'Supabase Edge Functions';
    access: 'Authenticated users only';
    audit: 'All access logged';
  };
  transmission: {
    protocol: 'TLS 1.3';
    headers: 'Encrypted headers';
    validation: 'HMAC signature';
  };
  usage: {
    rateLimit: 'Per-user rate limiting';
    monitoring: 'Usage analytics';
    alerting: 'Anomaly detection';
  };
}
```

### 3. プライバシー保護設計

**GDPR準拠アーキテクチャ：**

```typescript
interface PrivacyArchitecture {
  dataMinimization: {
    collection: 'Collect only necessary data';
    retention: 'Automatic data expiration';
    anonymization: 'PII anonymization';
  };
  userRights: {
    access: 'Data export functionality';
    rectification: 'Data correction interface';
    erasure: 'Right to be forgotten';
    portability: 'Data portability format';
  };
  consent: {
    granular: 'Feature-specific consent';
    withdrawal: 'Easy consent withdrawal';
    tracking: 'Consent audit trail';
  };
}
```

---

## 📊 パフォーマンス設計の最適化

### 1. フロントエンド最適化アーキテクチャ

**レンダリング最適化戦略：**

```typescript
interface FrontendOptimization {
  rendering: {
    ssr: {
      criticalPages: ['/', '/login'];
      hydration: 'Selective hydration';
      caching: 'Edge-side rendering cache';
    };
    csr: {
      interactivePages: ['/create', '/edit/*'];
      lazyLoading: 'Route-based code splitting';
      prefetching: 'Intelligent prefetching';
    };
  };
  bundleOptimization: {
    treeshaking: 'Dead code elimination';
    compression: 'Gzip + Brotli';
    minification: 'Terser + CSS minification';
  };
  assetOptimization: {
    images: 'WebP + AVIF formats';
    fonts: 'Font subsetting + preload';
    icons: 'SVG sprite optimization';
  };
}
```

### 2. データベース最適化アーキテクチャ

**クエリ最適化戦略：**

```typescript
interface DatabaseOptimization {
  indexing: {
    strategy: 'Query-pattern based indexing';
    composite: 'Multi-column indexes for complex queries';
    partial: 'Filtered indexes for specific conditions';
  };
  queryOptimization: {
    nPlusOne: 'Eager loading with joins';
    pagination: 'Cursor-based pagination';
    aggregation: 'Database-level aggregation';
  };
  caching: {
    queryCache: 'Redis-based query caching';
    resultCache: 'Application-level result caching';
    invalidation: 'Smart cache invalidation';
  };
}
```

### 3. API最適化アーキテクチャ

**API パフォーマンス戦略：**

```typescript
interface ApiOptimization {
  responseOptimization: {
    compression: 'Response compression';
    serialization: 'Efficient JSON serialization';
    pagination: 'Consistent pagination patterns';
  };
  caching: {
    httpCache: 'HTTP cache headers';
    edgeCache: 'CDN edge caching';
    applicationCache: 'Application-level caching';
  };
  rateLimit: {
    adaptive: 'Adaptive rate limiting';
    userBased: 'User-specific limits';
    gracefulDegradation: 'Graceful degradation';
  };
}
```

---

## 🧪 テスタビリティ設計

### 1. テスト駆動アーキテクチャ

**テスタビリティ原則：**

```typescript
interface TestabilityArchitecture {
  dependencyInjection: {
    pattern: 'Constructor injection';
    container: 'Lightweight DI container';
    mocking: 'Interface-based mocking';
  };
  separation: {
    pureFunction: 'Pure functions for business logic';
    sideEffects: 'Isolated side effects';
    testDoubles: 'Comprehensive test doubles';
  };
  observability: {
    logging: 'Structured logging';
    metrics: 'Business metrics';
    tracing: 'Distributed tracing';
  };
}
```

### 2. テスト戦略アーキテクチャ

**包括的テスト戦略：**

```typescript
interface TestStrategy {
  unit: {
    coverage: '90%+ for business logic';
    isolation: 'Complete isolation with mocks';
    speed: 'Sub-second execution';
  };
  integration: {
    apiTesting: 'Contract testing';
    databaseTesting: 'Transaction rollback';
    externalServices: 'Service virtualization';
  };
  e2e: {
    criticalPaths: 'User journey testing';
    crossBrowser: 'Multi-browser testing';
    performance: 'Performance regression testing';
  };
  security: {
    vulnerability: 'Automated vulnerability scanning';
    penetration: 'Regular penetration testing';
    compliance: 'Compliance testing';
  };
}
```

---

## 📋 設計ドキュメンテーション

### 1. Architecture Decision Records (ADR)

**ADRテンプレート：**

```markdown
# ADR-001: [決定事項のタイトル]

## ステータス

[提案中/承認済み/廃止済み]

## コンテキスト

[決定が必要になった背景と状況]

## 決定内容

[何を決定したか]

## 根拠

[なぜその決定をしたか]

## 結果

[決定による影響と期待される結果]

## 代替案

[検討した他の選択肢]

## 関連資料

[参考にした資料やドキュメント]
```

### 2. システム設計書

**設計書構成：**

```typescript
interface SystemDesignDocument {
  overview: {
    purpose: string;
    scope: string;
    stakeholders: string[];
  };
  architecture: {
    systemContext: string;
    containerDiagram: string;
    componentDiagram: string;
    deploymentDiagram: string;
  };
  qualityAttributes: {
    performance: PerformanceRequirements;
    security: SecurityRequirements;
    scalability: ScalabilityRequirements;
  };
  designDecisions: ADR[];
  riskAssessment: Risk[];
  implementationPlan: ImplementationPhase[];
}
```

### 3. API設計仕様

**API設計原則：**

```typescript
interface ApiDesignPrinciples {
  restful: {
    resourceOriented: 'Resource-based URLs';
    httpMethods: 'Appropriate HTTP methods';
    statusCodes: 'Meaningful status codes';
  };
  consistency: {
    naming: 'Consistent naming conventions';
    errorHandling: 'Standardized error responses';
    pagination: 'Consistent pagination format';
  };
  versioning: {
    strategy: 'URL versioning';
    backward: 'Backward compatibility';
    deprecation: 'Graceful deprecation';
  };
}
```

---

## 🚀 実装ガイダンス

### 1. 段階的実装戦略

**実装フェーズ：**

```typescript
interface ImplementationPhases {
  phase1_foundation: {
    duration: '2-3 weeks';
    deliverables: [
      'Core domain models',
      'Database schema',
      'Authentication setup',
      'Basic API structure',
    ];
    successCriteria: [
      'User can register/login',
      'Basic CRUD operations work',
      'Security policies active',
    ];
  };
  phase2_core: {
    duration: '3-4 weeks';
    deliverables: ['Prompt management', 'API key management', 'Basic execution', 'UI components'];
    successCriteria: [
      'Users can create/edit prompts',
      'API keys securely managed',
      'Basic prompt execution works',
    ];
  };
  phase3_enhancement: {
    duration: '2-3 weeks';
    deliverables: [
      'Advanced features',
      'Performance optimization',
      'Enhanced UI/UX',
      'Comprehensive testing',
    ];
    successCriteria: [
      'All features working smoothly',
      'Performance targets met',
      'User acceptance achieved',
    ];
  };
}
```

### 2. 品質ゲート

**各フェーズの品質基準：**

```typescript
interface QualityGates {
  architecture: {
    designReview: 'Peer review completed';
    adrDocumented: 'All decisions documented';
    riskAssessed: 'Risks identified and mitigated';
  };
  implementation: {
    codeQuality: 'SonarQube score > 8.0';
    testCoverage: 'Coverage > 90%';
    securityScan: 'No high/critical vulnerabilities';
  };
  performance: {
    loadTime: 'Page load < 2 seconds';
    apiResponse: 'API response < 500ms';
    throughput: 'Target throughput achieved';
  };
}
```

### 3. 継続的改善

**改善サイクル：**

```typescript
interface ContinuousImprovement {
  monitoring: {
    metrics: 'Key performance indicators';
    alerts: 'Proactive alerting';
    dashboards: 'Real-time dashboards';
  };
  feedback: {
    userFeedback: 'Regular user feedback collection';
    teamRetrospectives: 'Sprint retrospectives';
    performanceReview: 'Performance analysis';
  };
  evolution: {
    architectureEvolution: 'Quarterly architecture review';
    technologyUpgrade: 'Technology stack updates';
    processImprovement: 'Process optimization';
  };
}
```

---

## 🚨 リスク管理と対策

### 1. 技術的リスク

**リスク分類と対策：**

```typescript
interface TechnicalRisks {
  scalability: {
    risk: 'System cannot handle increased load';
    probability: 'Medium';
    impact: 'High';
    mitigation: [
      'Load testing in early phases',
      'Horizontal scaling architecture',
      'Performance monitoring',
    ];
  };
  security: {
    risk: 'Data breach or unauthorized access';
    probability: 'Low';
    impact: 'Critical';
    mitigation: [
      'Multi-layer security architecture',
      'Regular security audits',
      'Penetration testing',
    ];
  };
  dependency: {
    risk: 'Third-party service failure';
    probability: 'Medium';
    impact: 'Medium';
    mitigation: ['Circuit breaker pattern', 'Fallback mechanisms', 'Multiple provider strategy'];
  };
}
```

### 2. アーキテクチャ負債管理

**技術負債の予防と管理：**

```typescript
interface TechnicalDebtManagement {
  prevention: {
    codeReview: 'Mandatory peer reviews';
    architectureReview: 'Regular architecture reviews';
    refactoringTime: 'Dedicated refactoring time';
  };
  identification: {
    codeAnalysis: 'Static code analysis tools';
    performanceMonitoring: 'Performance degradation tracking';
    maintainabilityMetrics: 'Code complexity metrics';
  };
  resolution: {
    prioritization: 'Risk-based prioritization';
    planning: 'Debt resolution planning';
    tracking: 'Progress tracking';
  };
}
```

---

## 📚 参考資料とベ
