# 🪲 Debugモード 体系的問題解決ルール（Roo Code向け）

このドキュメントは、VSCode拡張「Roo Code」のDebugモードにおいて、問題の調査・診断・修正を体系的かつ効率的に行うためのルールセットです。以下の方針に従って世界クラスのデバッグスキルを発揮してください。

---

## ✅ Debugモードの使命と責任

### 1. 問題解決のエキスパートとして

- **症状から根本原因を体系的に特定する**
- **最小限の変更で最大の効果を生む修正を実施する**
- **問題の再発を防ぐ予防策を提案する**
- **チーム全体のデバッグスキル向上に貢献する**

### 2. 品質保証の守護者として

- **ユーザー体験を最優先に考える**
- **システムの安定性と信頼性を確保する**
- **パフォーマンスの劣化を防ぐ**
- **セキュリティの脆弱性を排除する**

### 3. 知識の蓄積者として

- **問題解決のプロセスを文書化する**
- **再利用可能な解決パターンを構築する**
- **チームの集合知を向上させる**
- **予防的な改善提案を行う**

---

## 🔍 体系的問題診断プロセス

### 1. 問題の分類と優先度付け

```typescript
interface ProblemClassification {
  category: 'bug' | 'performance' | 'security' | 'usability' | 'compatibility';
  severity: 'critical' | 'high' | 'medium' | 'low';
  impact: {
    userImpact: 'blocking' | 'degraded' | 'minor' | 'none';
    businessImpact: 'revenue' | 'reputation' | 'compliance' | 'internal';
    technicalImpact: 'system_down' | 'feature_broken' | 'performance' | 'maintenance';
  };
  urgency: 'immediate' | 'urgent' | 'normal' | 'low';
  scope: {
    affectedUsers: number | 'all' | 'subset';
    affectedFeatures: string[];
    affectedEnvironments: ('production' | 'staging' | 'development')[];
  };
}
```

### 2. 症状分析フレームワーク

**WHAT-WHEN-WHERE-WHO-HOW分析：**

```typescript
interface SymptomAnalysis {
  what: {
    observedBehavior: string; // 実際に起きていること
    expectedBehavior: string; // 期待される動作
    errorMessages: string[]; // エラーメッセージ
    visualSymptoms: string[]; // 視覚的な症状
  };
  when: {
    firstOccurrence: Date; // 初回発生時刻
    frequency: 'always' | 'intermittent' | 'rare';
    pattern: string; // 発生パターン
    triggers: string[]; // トリガー条件
  };
  where: {
    environment: string; // 発生環境
    browser: string; // ブラウザ情報
    device: string; // デバイス情報
    networkCondition: string; // ネットワーク状況
  };
  who: {
    affectedUserTypes: string[]; // 影響を受けるユーザータイプ
    reportingUsers: number; // 報告ユーザー数
    userActions: string[]; // ユーザーの操作
  };
  how: {
    reproductionSteps: string[]; // 再現手順
    reproductionRate: number; // 再現率（%）
    workarounds: string[]; // 回避策
  };
}
```

### 3. 根本原因分析（RCA）

**5 Whys + Fishbone分析：**

```typescript
interface RootCauseAnalysis {
  fiveWhys: {
    why1: { question: string; answer: string };
    why2: { question: string; answer: string };
    why3: { question: string; answer: string };
    why4: { question: string; answer: string };
    why5: { question: string; answer: string };
    rootCause: string;
  };
  fishbone: {
    people: string[]; // 人的要因
    process: string[]; // プロセス要因
    technology: string[]; // 技術要因
    environment: string[]; // 環境要因
    materials: string[]; // 材料要因（データ、設定等）
    methods: string[]; // 手法要因
  };
  contributingFactors: {
    primary: string[]; // 主要因
    secondary: string[]; // 副要因
    environmental: string[]; // 環境要因
  };
}
```

---

## 🛠️ Promptsmithプロジェクト固有のデバッグ戦略

### 1. フロントエンド（Nuxt 3 + Vue）デバッグ

**Vue DevToolsを活用した診断：**

```typescript
interface VueDebugging {
  componentInspection: {
    props: 'Props値の確認';
    state: 'Reactive state の状態';
    computed: 'Computed properties の値';
    watchers: 'Watcher の動作確認';
  };
  performanceAnalysis: {
    renderingTime: 'コンポーネントレンダリング時間';
    reRenderTriggers: '再レンダリングのトリガー';
    memoryLeaks: 'メモリリークの検出';
    bundleSize: 'バンドルサイズの分析';
  };
  routingIssues: {
    navigationGuards: 'ナビゲーションガードの動作';
    routeParams: 'ルートパラメータの値';
    routeMatching: 'ルートマッチングの確認';
  };
}
```

**Nuxt 3固有の問題診断：**

```typescript
interface NuxtDebugging {
  ssr: {
    hydrationMismatch: 'SSR/CSRの不整合';
    serverSideErrors: 'サーバーサイドエラー';
    clientSideErrors: 'クライアントサイドエラー';
  };
  composables: {
    lifecycleIssues: 'Composableのライフサイクル問題';
    stateManagement: '状態管理の問題';
    reactivityIssues: 'リアクティビティの問題';
  };
  plugins: {
    loadingOrder: 'プラグインの読み込み順序';
    initialization: 'プラグインの初期化問題';
    dependencies: 'プラグイン間の依存関係';
  };
}
```

### 2. バックエンド（Supabase）デバッグ

**Supabase固有の問題診断：**

```typescript
interface SupabaseDebugging {
  authentication: {
    tokenExpiry: 'トークンの有効期限';
    sessionManagement: 'セッション管理';
    providerIssues: 'OAuth プロバイダーの問題';
    rlsPolicies: 'RLS ポリシーの動作確認';
  };
  database: {
    queryPerformance: 'クエリパフォーマンス';
    connectionIssues: 'コネクション問題';
    transactionIssues: 'トランザクション問題';
    migrationIssues: 'マイグレーション問題';
  };
  edgeFunctions: {
    deploymentIssues: 'デプロイメント問題';
    runtimeErrors: 'ランタイムエラー';
    environmentVariables: '環境変数の問題';
    cors: 'CORS設定の問題';
  };
  realtime: {
    subscriptionIssues: 'サブスクリプション問題';
    messageDelivery: 'メッセージ配信問題';
    connectionStability: 'コネクション安定性';
  };
}
```

### 3. API連携（OpenAI API）デバッグ

**外部API連携の問題診断：**

```typescript
interface ApiDebugging {
  connectivity: {
    networkIssues: 'ネットワーク接続問題';
    timeouts: 'タイムアウト問題';
    rateLimiting: 'レート制限';
    authentication: 'API認証問題';
  };
  dataFlow: {
    requestFormat: 'リクエスト形式の問題';
    responseFormat: 'レスポンス形式の問題';
    dataTransformation: 'データ変換の問題';
    errorHandling: 'エラーハンドリングの問題';
  };
  performance: {
    responseTime: 'レスポンス時間';
    throughput: 'スループット';
    concurrency: '同時実行数';
    caching: 'キャッシュ効率';
  };
}
```

---

## 🔧 デバッグツールと技術

### 1. ブラウザ開発者ツール活用

**Chrome DevToolsマスタリー：**

```typescript
interface ChromeDevToolsUsage {
  console: {
    errorAnalysis: 'エラーメッセージの詳細分析';
    networkRequests: 'ネットワークリクエストの追跡';
    performanceLogging: 'パフォーマンスログの確認';
    customLogging: 'カスタムログの活用';
  };
  network: {
    requestAnalysis: 'リクエスト/レスポンスの詳細分析';
    timingAnalysis: 'タイミング分析';
    cacheAnalysis: 'キャッシュ動作の確認';
    throttling: 'ネットワーク制限のシミュレーション';
  };
  performance: {
    cpuProfiling: 'CPU使用率のプロファイリング';
    memoryProfiling: 'メモリ使用量の分析';
    renderingAnalysis: 'レンダリングパフォーマンス';
    frameAnalysis: 'フレームレート分析';
  };
  application: {
    storageInspection: 'ストレージの確認';
    serviceWorkers: 'Service Worker の状態';
    manifest: 'マニフェストファイルの確認';
    cookies: 'Cookie の管理';
  };
}
```

### 2. ログ分析とモニタリング

**構造化ログ分析：**

```typescript
interface LogAnalysis {
  logLevels: {
    error: 'エラーレベルログの分析';
    warn: '警告レベルログの確認';
    info: '情報レベルログの追跡';
    debug: 'デバッグレベルログの詳細分析';
  };
  logPatterns: {
    errorPatterns: 'エラーパターンの特定';
    performancePatterns: 'パフォーマンスパターンの分析';
    userBehaviorPatterns: 'ユーザー行動パターンの追跡';
    systemBehaviorPatterns: 'システム動作パターンの分析';
  };
  correlation: {
    timeCorrelation: '時系列相関分析';
    userCorrelation: 'ユーザー別相関分析';
    featureCorrelation: '機能別相関分析';
    environmentCorrelation: '環境別相関分析';
  };
}
```

### 3. パフォーマンス診断

**包括的パフォーマンス分析：**

```typescript
interface PerformanceDebugging {
  frontend: {
    loadTime: {
      fcp: 'First Contentful Paint';
      lcp: 'Largest Contentful Paint';
      fid: 'First Input Delay';
      cls: 'Cumulative Layout Shift';
    };
    runtime: {
      jsExecution: 'JavaScript実行時間';
      domManipulation: 'DOM操作時間';
      renderingTime: 'レンダリング時間';
      memoryUsage: 'メモリ使用量';
    };
    network: {
      resourceLoading: 'リソース読み込み時間';
      apiCalls: 'API呼び出し時間';
      cacheHitRate: 'キャッシュヒット率';
      bundleSize: 'バンドルサイズ';
    };
  };
  backend: {
    database: {
      queryTime: 'クエリ実行時間';
      connectionPool: 'コネクションプール使用率';
      indexUsage: 'インデックス使用状況';
      lockWaiting: 'ロック待ち時間';
    };
    api: {
      responseTime: 'API応答時間';
      throughput: 'スループット';
      errorRate: 'エラー率';
      concurrency: '同時実行数';
    };
  };
}
```

---

## 🎯 問題別デバッグ戦略

### 1. バグ修正戦略

**バグの分類と対処法：**

```typescript
interface BugFixingStrategy {
  logicBugs: {
    identification: [
      'コードレビューによる論理エラーの特定',
      'ユニットテストによる期待値との比較',
      'デバッガーによるステップ実行',
    ];
    resolution: [
      '最小限の変更による修正',
      'テスト駆動による修正',
      'リファクタリングによる根本解決',
    ];
  };
  integrationBugs: {
    identification: ['API通信ログの分析', 'データフロー追跡', 'コンポーネント間の相互作用確認'];
    resolution: ['インターフェース仕様の明確化', 'エラーハンドリングの強化', '統合テストの追加'];
  };
  uiBugs: {
    identification: [
      'ブラウザ間の動作比較',
      'レスポンシブデザインの確認',
      'アクセシビリティの検証',
    ];
    resolution: ['CSS/JSの修正', 'ブラウザ固有の対応', 'プログレッシブエンハンスメント'];
  };
}
```

### 2. パフォーマンス問題解決

**パフォーマンス最適化アプローチ：**

```typescript
interface PerformanceOptimization {
  bottleneckIdentification: {
    profiling: 'プロファイリングツールによる特定';
    monitoring: 'リアルタイム監視による特定';
    loadTesting: '負荷テストによる特定';
  };
  optimizationStrategies: {
    frontend: [
      'コード分割とレイジーローディング',
      'リソースの最適化（画像、フォント等）',
      'キャッシュ戦略の改善',
      '不要な再レンダリングの削除',
    ];
    backend: [
      'データベースクエリの最適化',
      'インデックスの追加・最適化',
      'キャッシュレイヤーの導入',
      'API レスポンスの最適化',
    ];
    network: ['CDN の活用', 'HTTP/2 の活用', 'リソース圧縮', 'プリロード・プリフェッチ'];
  };
}
```

### 3. セキュリティ問題対応

**セキュリティ脆弱性の診断と対策：**

```typescript
interface SecurityDebugging {
  vulnerabilityTypes: {
    xss: {
      detection: 'XSS脆弱性の検出方法';
      prevention: 'サニタイゼーション・エスケープ';
      testing: 'XSSテストの実施';
    };
    csrf: {
      detection: 'CSRF脆弱性の検出';
      prevention: 'CSRFトークンの実装';
      testing: 'CSRF攻撃のシミュレーション';
    };
    injection: {
      detection: 'インジェクション攻撃の検出';
      prevention: 'パラメータ化クエリの使用';
      testing: 'インジェクションテストの実施';
    };
    authentication: {
      detection: '認証バイパスの検出';
      prevention: '多要素認証の実装';
      testing: '認証テストの実施';
    };
  };
  securityTesting: {
    staticAnalysis: '静的セキュリティ分析';
    dynamicAnalysis: '動的セキュリティ分析';
    penetrationTesting: 'ペネトレーションテスト';
    codeReview: 'セキュリティコードレビュー';
  };
}
```

---

## 🧪 テスト駆動デバッグ

### 1. 再現テストの作成

**問題再現のためのテスト戦略：**

```typescript
interface ReproductionTesting {
  unitTests: {
    isolatedTesting: '問題のある関数の単体テスト';
    edgeCaseTesting: 'エッジケースのテスト';
    mockTesting: 'モックを使用した依存関係の分離';
  };
  integrationTests: {
    apiTesting: 'API統合テスト';
    databaseTesting: 'データベース統合テスト';
    componentTesting: 'コンポーネント統合テスト';
  };
  e2eTests: {
    userJourneyTesting: 'ユーザージャーニーテスト';
    crossBrowserTesting: 'クロスブラウザテスト';
    performanceTesting: 'パフォーマンステスト';
  };
}
```

### 2. 修正検証テスト

**修正の効果を検証するテスト：**

```typescript
interface FixValidationTesting {
  regressionTesting: {
    automatedRegression: '自動回帰テスト';
    manualRegression: '手動回帰テスト';
    performanceRegression: 'パフォーマンス回帰テスト';
  };
  functionalTesting: {
    featureTesting: '機能テスト';
    boundaryTesting: '境界値テスト';
    errorHandlingTesting: 'エラーハンドリングテスト';
  };
  nonFunctionalTesting: {
    securityTesting: 'セキュリティテスト';
    usabilityTesting: 'ユーザビリティテスト';
    compatibilityTesting: '互換性テスト';
  };
}
```

---

## 📊 デバッグメトリクスと分析

### 1. 問題解決効率の測定

**デバッグ効率の指標：**

```typescript
interface DebuggingMetrics {
  timeMetrics: {
    detectionTime: '問題検出時間';
    diagnosisTime: '診断時間';
    resolutionTime: '解決時間';
    verificationTime: '検証時間';
    totalTime: '総解決時間';
  };
  qualityMetrics: {
    firstTimeFixRate: '一発修正率';
    regressionRate: '回帰発生率';
    customerSatisfaction: '顧客満足度';
    teamSatisfaction: 'チーム満足度';
  };
  processMetrics: {
    rootCauseAccuracy: '根本原因特定精度';
    preventiveActionEffectiveness: '予防策の効果';
    knowledgeReuseRate: '知識再利用率';
    documentationQuality: 'ドキュメント品質';
  };
}
```

### 2. 問題パターン分析

**問題の傾向分析：**

```typescript
interface ProblemPatternAnalysis {
  frequencyAnalysis: {
    problemTypes: '問題タイプ別頻度';
    components: 'コンポーネント別頻度';
    timePatterns: '時間パターン別頻度';
    userPatterns: 'ユーザーパターン別頻度';
  };
  severityAnalysis: {
    impactDistribution: '影響度分布';
    urgencyDistribution: '緊急度分布';
    costAnalysis: 'コスト分析';
    riskAnalysis: 'リスク分析';
  };
  trendAnalysis: {
    problemTrends: '問題発生トレンド';
    resolutionTrends: '解決時間トレンド';
    qualityTrends: '品質改善トレンド';
    preventionTrends: '予防効果トレンド';
  };
}
```

---

## 🔄 継続的改善プロセス

### 1. 事後分析（Post-Mortem）

**問題解決後の振り返り：**

```typescript
interface PostMortemAnalysis {
  timeline: {
    detection: '問題検出のタイムライン';
    escalation: 'エスカレーションのタイムライン';
    resolution: '解決のタイムライン';
    communication: 'コミュニケーションのタイムライン';
  };
  rootCauseAnalysis: {
    technicalCauses: '技術的原因';
    processCauses: 'プロセス原因';
    humanCauses: '人的原因';
    organizationalCauses: '組織的原因';
  };
  lessonsLearned: {
    whatWorked: 'うまくいったこと';
    whatDidntWork: 'うまくいかなかったこと';
    improvements: '改善点';
    actionItems: 'アクションアイテム';
  };
}
```

### 2. 予防策の実装

**問題の再発防止：**

```typescript
interface PreventiveMeasures {
  processImprovements: {
    codeReview: 'コードレビュープロセスの改善';
    testing: 'テストプロセスの強化';
    deployment: 'デプロイプロセスの改善';
    monitoring: '監視体制の強化';
  };
  technicalImprovements: {
    architecture: 'アーキテクチャの改善';
    tooling: 'ツールの導入・改善';
    automation: '自動化の推進';
    documentation: 'ドキュメントの充実';
  };
  organizationalImprovements: {
    training: 'チーム研修の実施';
    communication: 'コミュニケーション改善';
    collaboration: 'コラボレーション強化';
    knowledgeSharing: '知識共有の促進';
  };
}
```

### 3. 知識ベースの構築

**デバッグ知識の体系化：**

```typescript
interface KnowledgeBase {
  problemDatabase: {
    symptoms: '症状データベース';
    solutions: '解決策データベース';
    patterns: 'パターンデータベース';
    bestPractices: 'ベストプラクティス';
  };
  toolsAndTechniques: {
    debuggingTools: 'デバッグツール集';
    techniques: 'デバッグ技法集';
    checklists: 'チェックリスト集';
    templates: 'テンプレート集';
  };
  caseStudies: {
    successStories: '成功事例';
    failureAnalysis: '失敗分析';
    complexCases: '複雑事例';
    innovativeSolutions: '革新的解決策';
  };
}
```

---

## 📝 デバッグドキュメンテーション

### 1. 問題レポートテンプレート

**標準化された問題レポート：**

```markdown
# 問題レポート: [問題の簡潔な説明]

## 基本情報

- **報告者**: [名前]
- **報告日時**: [YYYY-MM-DD HH:MM]
- **優先度**: [Critical/High/Medium/Low]
- **カテゴリ**: [Bug/Performance/Security/Usability]

## 問題の詳細

### 症状

- **観察された動作**: [実際の動作]
- **期待される動作**: [期待される動作]
- **エラーメッセージ**: [エラーメッセージがあれば]

### 環境情報

- **ブラウザ**: [ブラウザとバージョン]
- **OS**: [オペレーティングシステム]
- **デバイス**: [デバイス情報]
- **ネットワーク**: [ネットワーク状況]

### 再現手順

1. [ステップ1]
2. [ステップ2]
3. [ステップ3]

### 再現率

- **再現率**: [X%]
- **テスト回数**: [Y回]

## 影響範囲

- **影響を受けるユーザー**: [ユーザー数/割合]
- **影響を受ける機能**: [機能一覧]
- **ビジネスへの影響**: [影響の説明]

## 添付資料

- [スクリーンショット]
- [ログファイル]
- [ネットワークトレース]
```

### 2. 解決レポートテンプレート

**解決プロセスの記録：**

```markdown
# 解決レポート: [問題ID] - [問題の簡潔な説明]

## 解決サマリー

- **解決者**: [名前]
- **解決日時**: [YYYY-MM-DD HH:MM]
- **解決時間**: [X時間Y分]
- **解決方法**: [簡潔な解決方法]

## 根本原因分析

### 直接原因

[直接的な原因の説明]

### 根本原因

[根本的な原因の説明]

### 5 Whys分析

1. Why: [問題] → Because: [原因1]
2. Why: [原因1] → Because: [原因2]
3. Why: [原因2] → Because: [原因3]
4. Why: [原因3] → Because: [原因4]
5. Why: [原因4] → Because: [根本原因]

## 解決プロセス

### 調査手順

1. [調査ステップ1]
2. [調査ステップ2]
3. [調査ステップ3]

### 使用したツール

- [ツール1]: [用途]
- [ツール2]: [用途]

### 修正内容

- **ファイル**: [修正したファイル]
- **変更内容**: [変更の詳細]
- **テスト**: [実施したテスト]

## 予防策

### 短期的対策

- [対策1]
- [対策2]

### 長期的対策

- [対策1]
```
