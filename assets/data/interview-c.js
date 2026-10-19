/* 面试题库 · 第三部分：监控 / 容器 / 云 / 安全 / 实施交付 / 排障 / 软技能 */
window.QUESTIONS = (window.QUESTIONS || []).concat([
  /* ================= 监控告警与可观测性 ================= */
  { id: 73, mod: '监控日志', diff: '初级', q: '监控体系应该监控哪些层面？', tags: ['监控分层'],
    a: '<ul class="clean"><li>基础设施层：CPU、内存、磁盘、网络、负载、文件句柄。</li><li>中间件/数据库层：连接数、慢查询、主从延迟、队列堆积、缓存命中率。</li><li>应用层：QPS、RT（P95/P99）、错误率、线程池/连接池、JVM GC。</li><li>业务层：订单量、支付成功率、登录数——这才是老板看得懂的。</li><li>体验层：CDN 可用性、DNS、拨测（多地探针）。</li></ul>' },

  { id: 74, mod: '监控日志', diff: '中级', q: 'Prometheus 的架构和数据模型？pull 和 push 的区别？', tags: ['Prometheus'],
    a: '<ul class="clean"><li>时序数据库 + 多维标签（metric name + labels）；PromQL 查询；内置 TSDB 本地存储（默认 15 天）。</li><li>采用 pull 主动抓取（HTTP /metrics），配合服务发现；短生命周期任务用 Pushgateway。</li><li>组件：Prometheus Server、Exporter（node_exporter/mysqld_exporter）、Alertmanager、Grafana。</li><li>pull 的好处：目标健康可判断、配置集中；缺点是跨网络/被 NAT 隔离的场景要 push 或 federation。</li></ul>' },

  { id: 75, mod: '监控日志', diff: '中级', q: '4 种黄金指标（Four Golden Signals）是什么？', tags: ['SLO', '黄金指标'],
    a: '<ul class="clean"><li>延迟 Latency（区分成功请求与失败请求的延迟）、流量 Traffic、错误 Errors、饱和度 Saturation。</li><li>配合 SLO/SLI：如"P99 &lt; 300ms 且错误率 &lt; 0.1%"，用错误预算决定发布节奏。</li><li>告警应基于症状（用户受影响）而非原因（CPU 高），否则告警风暴且噪音大。</li></ul>' },

  { id: 76, mod: '监控日志', diff: '中级', q: '告警怎么配才不"狼来了"？告警分级怎么做？', tags: ['告警治理'],
    a: '<ul class="clean"><li>分级：P0 电话+短信（业务不可用）、P1 企业微信/钉钉（核心功能受损）、P2 工单/邮件（容量预警）、P3 日报（趋势）。</li><li>降噪：设置 for 持续时间（如 5m）避免毛刺、聚合分组（同机房同类型合并）、抑制规则（上游挂了不再告下游）。</li><li>每个告警必须有：含义、影响、排查手册链接、责任人。没有 runbook 的告警不发。</li><li>定期复盘告警：处理率、误报率，把长期无人处理的告警直接删掉。</li></ul>' },

  { id: 77, mod: '监控日志', diff: '中级', q: 'ELK 各组件的作用？日志采集链路怎么设计？', tags: ['ELK', '日志'],
    a: '<ul class="clean"><li>Filebeat/Logstash 采集与解析 → Kafka 缓冲（削峰解耦）→ Logstash 清洗 → Elasticsearch 存储索引 → Kibana 查询可视化。</li><li>索引按天滚动 + ILM 生命周期管理（热/温/冷/删除），否则磁盘必爆。</li><li>字段规范：时间戳、主机、服务名、traceId、level 必须有，否则没法关联排查。</li><li>量特别大可用 Loki（只索引标签，成本低）或 ClickHouse。</li></ul>' },

  { id: 78, mod: '监控日志', diff: '高级', q: 'Zabbix 和 Prometheus 怎么选？', tags: ['Zabbix', '选型'],
    a: '<ul class="clean"><li>Zabbix：传统主机/网络设备监控强，Agent 采集、模板丰富、自带告警与图形，适合 IDC/机房资产类监控。</li><li>Prometheus：云原生/容器动态环境强，多维标签 + 服务发现 + 强大的 PromQL，适合 K8s 与微服务。</li><li>现实做法常是并存：Zabbix 管硬件与网络设备，Prometheus 管应用与容器，Grafana 统一展示。</li><li>选型看：环境是否动态、是否有历史资产、团队熟悉度、是否需要长期存储（需 VictoriaMetrics/Thanos）。</li></ul>' },

  { id: 79, mod: '监控日志', diff: '中级', q: '链路追踪（Tracing）解决什么问题？traceId 怎么串起来？', tags: ['Tracing', 'traceId'],
    a: '<ul class="clean"><li>解决微服务下"一次请求经过 10 个服务，慢在哪"的问题。</li><li>traceId 全链路透传（HTTP header / RPC context / MQ 消息属性），每个 span 记录服务、耗时、状态。</li><li>标准：OpenTelemetry（统一 metrics/logs/traces），后端可用 Jaeger、SkyWalking、Zipkin。</li><li>运维价值：日志里带 traceId 就能一键拉出全链路日志，排查效率翻倍。</li></ul>' },

  /* ================= 容器与云原生 ================= */
  { id: 80, mod: '容器云原生', diff: '初级', q: '容器和虚拟机的区别？Docker 的核心技术是什么？', tags: ['Docker', '容器'],
    a: '<ul class="clean"><li>VM 虚拟化硬件、每台有独立内核，隔离强但重；容器共享宿主内核，进程级隔离，轻量秒级启动。</li><li>核心技术：Namespace（隔离视图：pid/net/mnt/uts/ipc/user）、Cgroups（资源限制）、UnionFS（分层镜像）。</li><li>因此容器"隔离性弱于 VM"：内核漏洞可逃逸，多租户场景要配 seccomp/AppArmor 或跑在轻量 VM（kata/Firecracker）里。</li></ul>' },

  { id: 81, mod: '容器云原生', diff: '中级', q: '镜像分层与构建优化怎么做？', tags: ['镜像', 'Dockerfile'],
    a: '<ul class="clean"><li>每条指令一层，层可复用缓存；把变化少的放前面（依赖安装），变化多的放后面（源码拷贝）。</li><li>多阶段构建（multi-stage）减小体积；用 alpine/distroless 基础镜像；合并 RUN 并清理缓存。</li><li>不要把密钥、.git、node_modules 打进镜像（.dockerignore）。</li><li>镜像要打不可变 tag（git sha）+ 扫描漏洞（trivy）。</li></ul>',
    cmd: 'docker build -t app:$(git rev-parse --short HEAD) .\ndocker history app:latest\ndocker image prune -a' },

  { id: 82, mod: '容器云原生', diff: '高级', q: '容器里磁盘/内存异常怎么排查？', tags: ['容器排障'],
    a: '<ul class="clean"><li>先看容器状态：<code>docker ps -a</code> / <code>docker inspect</code>（OOMKilled 标记）、<code>docker stats</code>。</li><li>进容器：<code>docker exec -it</code>；连 exec 都失败用 <code>docker cp</code> 或 <code>nsenter</code> 进 namespace。</li><li>日志：<code>docker logs --tail 200</code>；日志驱动配置不当会导致宿主 /var/lib/docker 撑爆。</li><li>查磁盘：容器可写层与 volume 分开看；<code>docker system df</code> 看镜像/容器/卷占用。</li></ul>' },

  { id: 83, mod: '容器云原生', diff: '中级', q: 'Kubernetes 的核心对象有哪些？Pod 和容器的关系？', tags: ['K8s', 'Pod'],
    a: '<ul class="clean"><li>工作负载：Pod（最小调度单元，可含多容器共享网络/存储）、Deployment（无状态）、StatefulSet（有状态+稳定标识）、DaemonSet（每节点一个）、Job/CronJob。</li><li>服务与网络：Service（ClusterIP/NodePort/LoadBalancer）、Ingress、NetworkPolicy。</li><li>配置与存储：ConfigMap、Secret、PV/PVC、StorageClass。</li><li>Pod 是"一个或一组紧耦合容器 + 共享网络命名空间"，容器之间通过 localhost 互通。</li></ul>' },

  { id: 84, mod: '容器云原生', diff: '高级', q: 'Pod 一直 Pending / CrashLoopBackOff 怎么排查？', tags: ['K8s', '排障'],
    a: '<ul class="clean"><li>Pending：调度失败——资源不足（requests 太大）、节点亲和/污点不匹配、PVC 未绑定。看 <code>kubectl describe pod</code> 的 Events。</li><li>CrashLoopBackOff：容器启动后退出——配置错误、依赖连不上、健康检查太严导致被杀、OOMKilled（<code>lastState.terminated.reason</code>）。</li><li>ImagePullBackOff：镜像名/仓库凭证/网络问题。</li><li>常用：<code>kubectl logs --previous</code> 看上次崩溃日志，<code>kubectl get events --sort-by=.lastTimestamp</code>。</li></ul>',
    cmd: 'kubectl get pods -o wide\nkubectl describe pod <pod> \nkubectl logs <pod> --previous\nkubectl get events -A --sort-by=.lastTimestamp | tail -30' },

  { id: 85, mod: '容器云原生', diff: '高级', q: 'Service 的几种类型和 kube-proxy 的转发模式？', tags: ['K8s', 'Service'],
    a: '<ul class="clean"><li>ClusterIP（集群内）、NodePort（节点端口 30000-32767）、LoadBalancer（云 LB）、ExternalName（CNAME）。</li><li>kube-proxy 模式：iptables（默认、规则多时性能下降）、ipvs（哈希表、大规模更优）、userspace（已淘汰）。</li><li>Service 通过 label selector 选定 Endpoints；无 selector 时可手动建 Endpoints 指向外部服务。</li><li>Ingress 是七层入口，需配合 Ingress Controller（nginx-ingress/traefik）。</li></ul>' },

  { id: 86, mod: '容器云原生', diff: '中级', q: 'K8s 的探针有哪几种？配置错误会导致什么？', tags: ['探针', '健康检查'],
    a: '<ul class="clean"><li>livenessProbe（失败重启）、readinessProbe（失败摘流量）、startupProbe（启动慢时保护前两者）。</li><li>配置过严：liveness 超时太短 → 应用被反复重启（尤其启动慢的 Java）；readiness 过早 → 流量打到未就绪实例。</li><li>建议：startupProbe 覆盖启动期，liveness 只判"死没死"（别查依赖），readiness 判"能不能接流量"。</li><li>探针要留足 initialDelaySeconds 与 failureThreshold。</li></ul>' },

  { id: 87, mod: '容器云原生', diff: '中级', q: 'requests 和 limits 的区别？设错会怎样？', tags: ['资源配额', 'QoS'],
    a: '<ul class="clean"><li>requests 用于调度（保证量），limits 是上限（CPU 超了被限流 throttling，内存超了被 OOMKilled）。</li><li>QoS：Guaranteed（req=limit）、Burstable、BestEffort（都不设，最容易被驱逐）。</li><li>只设 limits 不设 requests 会导致调度不均与节点超卖；Java 容器要配 <code>-XX:MaxRAMPercentage</code> 适配 cgroup 限制。</li><li>用 VPA/HPA 做弹性，配合 metrics-server。</li></ul>' },

  /* ================= 云平台与虚拟化 ================= */
  { id: 88, mod: '云平台虚拟化', diff: '初级', q: '云上常见的 IaaS/PaaS/SaaS 区别？运维职责如何变化？', tags: ['云计算'],
    a: '<ul class="clean"><li>IaaS 管虚拟机/网络/存储（用户管 OS 以上）；PaaS 管运行时与中间件（用户只管应用）；SaaS 直接用（用户只管账号）。</li><li>运维职责随之上移：从装系统 → 管配置/发布/可观测性/成本。</li><li>云上必看：VPC 网络规划、安全组、快照与备份、按量/包年成本、可用区高可用。</li></ul>' },

  { id: 89, mod: '云平台虚拟化', diff: '中级', q: 'VPC、子网、安全组、NACL 的关系？', tags: ['VPC', '网络'],
    a: '<ul class="clean"><li>VPC 是隔离的虚拟网络，划分子网（可用区级别），路由表决定流量走向。</li><li>安全组作用于实例（有状态，默认拒绝入站）；NACL 作用于子网（无状态，需分别配置进出）。</li><li>出网：NAT 网关；对外提供服务：EIP/负载均衡；跨 VPC：对等连接/云企业网。</li><li>经典故障：安全组没放行、路由表指向错误、NAT 网关带宽打满。</li></ul>' },

  { id: 90, mod: '云平台虚拟化', diff: '中级', q: '云服务器 CPU 和内存占用不高但负载很高，怎么查？', tags: ['负载', '排障'],
    a: '<ul class="clean"><li>负载高不等于 CPU 忙：先 <code>uptime</code> 看 load，再看 <code>vmstat 1</code> 的 r（运行队列）与 b（阻塞）列。</li><li>常见原因：大量 D 状态进程（IO 等待、NFS 卡住、磁盘故障）、内存不足导致 swap 抖动、大量线程争锁。</li><li>用 <code>ps -eo state,pid,cmd | grep "^D"</code> 找不可中断进程，<code>iostat -x 1</code> 看 %util 与 await。</li><li>云盘 IOPS 有上限（尤其普通云盘），突发额度耗尽也会表现为此。</li></ul>',
    cmd: 'uptime\nvmstat 1 5\niostat -x 1\nps -eo state,pid,pcpu,pmem,cmd --sort=-pcpu | head' },

  { id: 91, mod: '云平台虚拟化', diff: '中级', q: '快照和备份的区别？云上数据保护怎么做？', tags: ['备份', '快照', '容灾'],
    a: '<ul class="clean"><li>快照是存储层的时点副本，快但通常同区域、依赖云平台，误删/勒索病毒可一并被删。</li><li>备份要独立（异地/跨账号/离线），并定期做恢复演练验证。</li><li>策略：3-2-1 原则（3 份副本、2 种介质、1 份异地）、RPO/RTO 明确、关键库 binlog 归档。</li><li>别忘了对象存储的版本控制与防删除策略。</li></ul>' },

  { id: 92, mod: '云平台虚拟化', diff: '中级', q: 'VMware vSphere 里虚拟机迁移和 HA 的原理？', tags: ['VMware', 'HA'],
    a: '<ul class="clean"><li>vMotion：运行中迁移，内存页热拷贝 + 短暂切换，要求共享存储与兼容 CPU；Storage vMotion 迁移存储。</li><li>HA：集群内主机故障后在其他主机重启虚拟机（有中断，分钟级）；FT 是锁步双机零中断（性能损耗大）。</li><li>DRS：基于资源做自动负载均衡与迁移。</li><li>要求：共享存储（SAN/NAS/vSAN）、心跳网络、集群内主机资源预留。</li></ul>' },

  /* ================= 安全合规 ================= */
  { id: 93, mod: '安全合规', diff: '初级', q: 'Linux 主机安全加固你会做哪些？', tags: ['加固', '基线'],
    a: '<ul class="clean"><li>账号：禁用 root 远程登录、禁止空口令、sudo 精细授权、删除无用账号、密码策略（PAM）。</li><li>访问：SSH 密钥登录 + 改端口 + 限制来源 IP + fail2ban；防火墙最小放行。</li><li>系统：关闭无用服务、及时打补丁、内核参数加固（sysctl）、文件权限与 umask。</li><li>审计：开 auditd、日志外发到日志服务器（防本地被删）、定时基线扫描。</li></ul>',
    cmd: 'ss -lntup                     # 看暴露端口\nlastb | head                  # 暴力破解记录\nawk -F: \'$3==0{print $1}\' /etc/passwd   # UID 为 0 的账号' },

  { id: 94, mod: '安全合规', diff: '中级', q: '等保 2.0 的五个级别和"一个中心三重防护"是什么？', tags: ['等保2.0'],
    a: '<ul class="clean"><li>五级：一级自主保护 → 五级专控保护；常见系统做二级或三级。三级需每年测评一次。</li><li>"一个中心、三重防护"：安全管理中心 + 安全计算环境、安全区域边界、安全通信网络。</li><li>十大类控制项：安全物理环境、通信网络、区域边界、计算环境、管理中心、管理制度、机构、人员、建设、运维管理。</li><li>运维落地重点：身份鉴别（双因素）、访问控制、入侵防范、恶意代码防范、数据备份恢复、安全审计、漏洞与补丁管理。</li></ul>' },

  { id: 95, mod: '安全合规', diff: '高级', q: '服务器被入侵了，应急处置流程是什么？', tags: ['应急响应', '入侵'],
    a: '<ul class="clean"><li>先隔离（断网/摘负载，但保留现场），别急着删文件或重启。</li><li>取证：保存内存与磁盘镜像、<code>ps aux</code>、<code>netstat -antp</code>、crontab、/tmp、authorized_keys、bash_history、系统日志。</li><li>定位入口：Web 日志找 webshell 上传点、弱口令爆破、漏洞版本；清理后必须修补根因。</li><li>恢复：重装系统重建（不要相信被入侵的机器）、改所有相关密码与密钥、上报与复盘（按法规可能需要报告）。</li></ul>',
    tip: '答题时强调"保留证据"和"重建而非修补"，这是加分项。' },

  { id: 96, mod: '安全合规', diff: '中级', q: 'HTTPS 的握手过程？证书链怎么校验？', tags: ['HTTPS', 'TLS'],
    a: '<ul class="clean"><li>TLS1.2：ClientHello（支持的套件+随机数）→ ServerHello + 证书 → 客户端校验证书链 → 密钥交换（ECDHE）→ 双方派生会话密钥 → Finished。</li><li>证书链：服务器证书 → 中间 CA → 根 CA（在客户端信任库中）；任一环缺证书或过期都会报错。</li><li>常见问题：证书过期、域名不匹配（SAN 缺失）、中间证书未配置（部分客户端才报错）、时间不同步导致校验失败。</li><li>TLS1.3 简化为 1-RTT（甚至 0-RTT），去掉 RSA 密钥交换，只保留前向安全的 ECDHE。</li></ul>' },

  /* ================= 实施交付与项目管理 ================= */
  { id: 97, mod: '实施交付', diff: '初级', q: '软件实施工程师的日常工作包括哪些？', tags: ['实施', '交付'],
    a: '<ul class="clean"><li>需求调研与确认、环境规划（服务器/网络/中间件）、部署安装、数据初始化与迁移、联调测试、用户培训、上线保障、验收与文档交付。</li><li>核心能力：沟通（对接客户与研发）、文档（方案/手册/验收单）、排障、项目节奏把控。</li><li>本质是"把标准产品在客户现场落地并让客户用起来"。</li></ul>' },

  { id: 98, mod: '实施交付', diff: '中级', q: '一个新项目上线，你的实施计划怎么排？', tags: ['实施计划', '上线'],
    a: '<ul class="clean"><li>阶段：环境准备 → 部署与配置 → 数据迁移 → 集成联调 → UAT 用户验收 → 培训 → 上线切换 → 观察期 → 验收交付。</li><li>每阶段有明确交付物与责任人；关键节点设里程碑与评审。</li><li>风险前置：提前确认网络策略开通、域名证书、第三方接口、客户配合人力。</li><li>上线方案必须包含回滚步骤与判定条件（多久内出问题就回滚）。</li></ul>' },

  { id: 99, mod: '实施交付', diff: '中级', q: '数据迁移怎么做才安全？', tags: ['数据迁移'],
    a: '<ul class="clean"><li>先盘点：数据量、表结构差异、脏数据、编码（历史库可能是 GBK）、大字段。</li><li>方案：全量 + 增量（binlog/时间戳），迁移工具（mysqldump/DataX/Kettle/自研脚本），必要时双写过渡。</li><li>校验：条数、金额汇总、抽样比对、业务方确认，缺一不可。</li><li>必须演练并在可回滚窗口内操作；旧库保留只读一段时间。</li></ul>' },

  { id: 100, mod: '实施交付', diff: '高级', q: '客户现场环境受限（不能上网、老系统），你怎么完成部署？', tags: ['离线部署', '现场'],
    a: '<ul class="clean"><li>离线包：提前打好全量依赖（rpm/deb、pip wheel、docker save 镜像、maven 私服），附校验值与安装脚本。</li><li>兼容性：确认 OS 版本与内核、glibc、CPU 架构（x86/ARM）、浏览器版本。</li><li>变通：本地搭 HTTP 源/私服；用容器固化运行环境；实在不行用静态编译二进制。</li><li>交付物要有"一键部署脚本 + 部署手册 + 常见问题"，减少对个人的依赖。</li></ul>' },

  { id: 101, mod: '实施交付', diff: '中级', q: '上线后发现严重 Bug，你怎么办？', tags: ['应急', '回滚'],
    a: '<ul class="clean"><li>先止血：判断影响面，能回滚立即回滚（回滚优先于修复，尤其在高峰期）。</li><li>若不能回滚：降级/关闭问题功能（开关）、限流、临时补丁。</li><li>同步：立即告知客户与项目经理，给出影响范围与预计恢复时间，别自己扛着。</li><li>事后：根因分析、补测试用例、复盘流程漏洞（如为什么测试没发现）。</li></ul>' },

  { id: 102, mod: '实施交付', diff: '中级', q: '怎么做好客户沟通与期望管理？', tags: ['沟通', '软技能'],
    a: '<ul class="clean"><li>需求变更必须书面确认（邮件/需求单），口头承诺是事故之源。</li><li>定期同步进展（周报/例会），风险早暴露——坏消息要早说，越晚代价越大。</li><li>区分"客户说的"和"客户真正要的"，用场景确认。</li><li>交付物清单化，验收标准提前对齐，避免最后扯皮。</li></ul>' },

  { id: 103, mod: '实施交付', diff: '中级', q: '运维如何做容量规划？', tags: ['容量规划'],
    a: '<ul class="clean"><li>基于历史指标做趋势外推（QPS、存储增长、连接数），预留突发系数（如大促 3~5 倍）。</li><li>压测获取单机承载能力，算出所需实例数，再加冗余（N+1 或 N+2）。</li><li>关注瓶颈点：DB 连接数、磁盘 IOPS、带宽、许可证。</li><li>定期（季度）复核，结合成本做优化（降配、弹性伸缩）。</li></ul>' },

  /* ================= 故障排查与应急 ================= */
  { id: 104, mod: '故障排查', diff: '初级', q: '线上故障排查的通用思路是什么？', tags: ['排障方法论'],
    a: '<ul class="clean"><li>1) 确认现象与影响面（谁受影响、多大范围、什么时候开始）。</li><li>2) 查最近变更（发布、配置、扩容、证书、DNS）——大部分故障来自变更。</li><li>3) 分层定位：网络 → 系统 → 中间件 → 应用 → 数据，逐层排除。</li><li>4) 先恢复再定位根因（止血优先），保留现场。</li><li>5) 事后复盘，形成检查项。</li></ul>',
    tip: '回答时把"变更"放在很前面，面试官会认为你有实战经验。' },

  { id: 105, mod: '故障排查', diff: '中级', q: 'CPU 使用率 100% 怎么定位到具体进程和线程？', tags: ['CPU', '性能'],
    a: '<ul class="clean"><li><code>top</code> 找到高 CPU 进程 → <code>top -Hp &lt;pid&gt;</code> 找线程 → 线程 id 转 16 进制 → <code>jstack &lt;pid&gt; | grep -A 20 nid=0x...</code>（Java）或 <code>perf top</code>（C/C++）。</li><li>常见原因：死循环、频繁 GC、正则回溯、加密计算、被挖矿（检查异常进程与外连）。</li><li>也看 <code>pidstat -u 1</code> 区分用户态/内核态（sys 高看系统调用、软中断）。</li></ul>',
    cmd: 'top -b -n1 | head -15\ntop -Hp 12345\nprintf "%x\\n" 12346\njstack 12345 | grep -A 30 "nid=0x303a"' },

  { id: 106, mod: '故障排查', diff: '中级', q: '磁盘 IO 高 / 磁盘满了怎么查？', tags: ['磁盘', 'IO'],
    a: '<ul class="clean"><li>IO：<code>iostat -x 1</code> 看 %util、await、r/s w/s；<code>iotop -o</code> 定位进程；<code>pidstat -d 1</code>。</li><li>磁盘满：<code>df -h</code> 看分区 → <code>du -sh /* | sort -h</code> 逐层找 → <code>lsof | grep deleted</code> 找被删除但仍被占用的文件（重启进程才释放）。</li><li>inode 满：<code>df -i</code>，大量小文件场景（session、缓存）。</li><li>治理：日志轮转（logrotate）、清理策略、分区规划、监控水位。</li></ul>',
    cmd: 'df -h; df -i\ndu -sh /var/* 2>/dev/null | sort -h | tail\nlsof +L1 | head\niostat -x 1 3' },

  { id: 107, mod: '故障排查', diff: '中级', q: '一台机器 ping 不通，怎么排查？', tags: ['网络排障'],
    a: '<ul class="clean"><li>先确认是 ICMP 被禁还是真不通（很多云主机默认禁 ping，用 telnet/nc 测端口）。</li><li>本机：网卡是否 up、IP/掩码/网关是否正确、路由表、防火墙（iptables/firewalld/安全组）。</li><li>链路：同网段能否通 → 网关能否通 → 逐跳 traceroute → 对端是否监听。</li><li>DNS 与 ARP 也常是原因（同网段 ARP 冲突、IP 冲突）。</li></ul>',
    cmd: 'ip a; ip route\nping -c2 网关\nnc -vz 目标 端口\ntraceroute -n 目标\nss -lntp | grep 端口' },

  { id: 108, mod: '故障排查', diff: '高级', q: '网站打不开，从用户到后端的完整排查路径？', tags: ['全链路', '排障'],
    a: '<ul class="clean"><li>DNS：<code>dig/nslookup</code> 解析是否正确、是否有 CDN 缓存旧记录。</li><li>网络：本地是否能连 443，traceroute 看链路，是否有地域性故障。</li><li>入口：LB/SLB 健康检查状态、证书是否过期、WAF 是否拦截。</li><li>应用：Nginx 错误日志、上游 5xx、后端进程与线程池、DB/缓存连接。</li><li>数据：慢查询、锁等待、磁盘满、连接数打满。</li><li>链路：按"用户→DNS→CDN→LB→Nginx→应用→中间件→DB"逐段验证，每段有独立的验证命令。</li></ul>' },

  { id: 109, mod: '故障排查', diff: '高级', q: '什么是"雪崩"和"惊群"？系统层面怎么防？', tags: ['雪崩', '限流'],
    a: '<ul class="clean"><li>雪崩：某环节故障导致流量/重试压垮整条链路。防御：超时、重试退避+抖动、熔断（熔断器）、限流、舱壁隔离（独立线程池/连接池）、降级。</li><li>惊群：大量进程/线程同时等待同一事件，事件到来全部被唤醒争抢。Nginx 用 epoll + accept_mutex 缓解，内核用 SO_REUSEPORT。</li><li>关键原则：调用方必须有超时，绝不无限等待。</li></ul>' },

  { id: 110, mod: '故障排查', diff: '中级', q: '如何写一份合格的故障复盘报告？', tags: ['复盘', 'SRE'],
    a: '<ul class="clean"><li>结构：故障概述（时间线/影响面/时长）、处理过程、根因分析（5 Why）、改进措施（含负责人与 deadline）、经验教训。</li><li>原则：对事不对人（blameless），重点是系统与流程改进，而非追责。</li><li>措施要可验证：加监控、加演练、改流程、补测试，并在下次复盘时检查闭环。</li><li>关键指标：MTTD（发现时长）、MTTR（恢复时长）。</li></ul>' },

  /* ================= 职业发展与软实力 ================= */
  { id: 111, mod: '职业发展', diff: '初级', q: '运维工程师的成长路径是怎样的？', tags: ['职业规划'],
    a: '<ul class="clean"><li>初级运维/实施（装环境、值班、按手册操作）→ 中级（独立负责系统、排障、自动化脚本）→ 高级/SRE（架构、容量、稳定性体系）→ 专家/管理（技术负责人、运维经理、架构师）。</li><li>方向分化：SRE/稳定性、云原生平台、DBA、安全、DevOps 工具链、解决方案架构。</li><li>关键跃迁点：从"会操作"到"能设计"，从"救火"到"防火"。</li></ul>' },

  { id: 112, mod: '职业发展', diff: '中级', q: '你平时怎么学习新技术？举个例子。', tags: ['学习能力'],
    a: '<ul class="clean"><li>给一个具体路径：官方文档打底 → 动手搭实验环境 → 输出笔记/博客 → 在项目里用起来。</li><li>例：学 K8s——先跟官方 tutorial 跑通 minikube，再在生产搭一套测试集群，把公司一个无状态服务迁上去，记录踩坑，最后写成内部文档。</li><li>强调"输出"和"落地"，比说"我看了很多书"有说服力。</li></ul>' },

  { id: 113, mod: '职业发展', diff: '中级', q: '运维的价值怎么体现？如何避免被当成"背锅侠"？', tags: ['价值', '软技能'],
    a: '<ul class="clean"><li>用数据说话：可用性（99.9% → 99.99%）、MTTR 下降、成本优化金额、自动化节省的人力。</li><li>把工作产品化：监控看板、自助发布平台、巡检报告，让成果可见。</li><li>流程留痕：变更审批、操作记录、故障复盘，责任边界清晰。</li><li>主动参与架构评审，从源头减少运维负担。</li></ul>' },

  { id: 114, mod: '职业发展', diff: '中级', q: '凌晨接到告警电话，你的第一反应是什么？', tags: ['值班', '情景题'],
    a: '<ul class="clean"><li>先确认告警真伪与影响面（看监控大盘，是单机还是全站），避免盲目操作。</li><li>按 runbook 处理；无 runbook 时先做低风险止血（重启单实例、摘流量），不做不可逆操作。</li><li>同步信息：在值班群说明现象与处理中，让相关人知情。</li><li>处理完记录并补 runbook，把这次经验变成下次的自动化。</li></ul>' },

  { id: 115, mod: '职业发展', diff: '中级', q: '如何看待自动化？你做过哪些自动化？', tags: ['自动化'],
    a: '<ul class="clean"><li>自动化优先级：高频重复 &gt; 易错 &gt; 耗时；先脚本化，再平台化。</li><li>举例：批量巡检脚本（采集 CPU/磁盘/证书到期并推送）、日志清理、自动扩容、一键部署（Ansible role/Jenkins pipeline）。</li><li>注意：自动化的前提是标准化（统一目录、统一端口、统一日志格式），否则自动化会把混乱放大。</li><li>要有人工兜底与灰度，别让自动化脚本一把梭。</li></ul>' },

  { id: 116, mod: '职业发展', diff: '高级', q: '如果让你从零搭建一个公司的运维体系，你会怎么做？', tags: ['体系设计', '开放题'],
    a: '<ul class="clean"><li>第一步摸家底：资产清单（服务器/域名/证书/账号/依赖）、现状痛点、团队能力。</li><li>基础设施标准化：统一 OS 基线、目录规范、配置管理（Ansible）、堡垒机与权限。</li><li>可观测性：指标 + 日志 + 告警分级 + 值班 runbook。</li><li>发布与变更：CI/CD、灰度、回滚机制、变更审批。</li><li>数据安全：备份策略 + 恢复演练 + 等保合规。</li><li>最后才是平台化与成本优化；顺序错了会做出一堆没人用的工具。</li></ul>',
    tip: '这题考的是体系感，先讲顺序和原因，再讲工具。' },

  { id: 117, mod: '职业发展', diff: '中级', q: '你遇到过最难的一次故障是什么？怎么解决的？', tags: ['行为面试', 'STAR'],
    a: '<ul class="clean"><li>用 STAR：情境（Situation）→ 任务（Task）→ 行动（Action）→ 结果（Result）。</li><li>结构建议：现象 → 初步判断 → 排查过程（用了什么命令/工具，排除了哪些可能）→ 根因 → 处理 → 后续改进。</li><li>一定要有量化结果（恢复时长、影响用户数、改进后指标）。</li><li>诚实说明自己当时的判断失误与学到的东西，比完美故事更可信。</li></ul>' }
]);
