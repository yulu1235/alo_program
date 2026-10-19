/* 学习资源库 · 链接均取自公开搜索结果与各产品官方文档入口 */
window.RESOURCES = [
  {
    name: '一、官方文档 · 第一手资料（优先读）',
    items: [
      { t: 'Linux man-pages 手册', u: 'https://man7.org/linux/man-pages/', d: '命令参数的最终解释权。查参数、查信号、查系统调用，比任何博客都准。', type: '官方文档' },
      { t: 'Linux 内核文档', u: 'https://www.kernel.org/doc/html/latest/', d: 'cgroup、网络栈、文件系统等内核行为的权威说明，排查深层问题时用。', type: '官方文档' },
      { t: 'GNU Bash 官方手册', u: 'https://www.gnu.org/software/bash/manual/bash.html', d: 'Shell 语法、扩展、内建命令的权威参考，写脚本卡住时查这里。', type: '官方文档' },
      { t: 'MySQL 8.0 参考手册', u: 'https://dev.mysql.com/doc/refman/8.0/en/', d: '参数、锁、复制、备份恢复的官方说明，含大量示例。', type: '官方文档' },
      { t: 'Redis 官方文档', u: 'https://redis.io/docs/latest/', d: '数据类型、持久化、集群、运维命令，版本更新快，以官方为准。', type: '官方文档' },
      { t: 'PostgreSQL 官方文档（中文）', u: 'https://www.postgresql.org/docs/current/', d: '接触 PG 项目时必备，事务与索引机制比 MySQL 更严谨。', type: '官方文档' },
      { t: 'Nginx 官方文档', u: 'https://nginx.org/en/docs/', d: '指令字典，proxy、upstream、限流模块的准确语义。', type: '官方文档' },
      { t: 'Nginx Admin Guide', u: 'https://docs.nginx.com/nginx/admin-guide/', d: '按场景组织的运维指南：负载均衡、缓存、安全控制。', type: '官方文档' },
      { t: 'Kafka 官方文档', u: 'https://kafka.apache.org/documentation/', d: '副本、ISR、消费者组、配置参数，消息队列面试的源头。', type: '官方文档' },
      { t: 'RabbitMQ 官方文档', u: 'https://www.rabbitmq.com/docs', d: '交换机类型、确认机制、集群与镜像队列。', type: '官方文档' },
      { t: 'Docker 官方文档', u: 'https://docs.docker.com/', d: '镜像、网络、存储、Compose 的标准用法。', type: '官方文档' },
      { t: 'Kubernetes 中文文档', u: 'https://kubernetes.io/zh-cn/docs/home/', d: '概念 + 任务 + 参考三部分，中文翻译质量不错。', type: '官方文档' },
      { t: 'K8s 生产环境部署', u: 'https://kubernetes.io/zh-cn/docs/setup/production-environment/', d: 'kubeadm、容器运行时、高可用拓扑的官方路径。', type: '官方文档' },
      { t: 'Ansible 中文文档', u: 'https://docs.ansible.org.cn/projects/ansible/latest/', d: 'Playbook、模块、角色，批量运维的入门首选。', type: '官方文档' },
      { t: 'Ansible 英文文档', u: 'https://docs.ansible.com/ansible/latest/index.html', d: '版本更新更及时，中文滞后时看这里。', type: '官方文档' },
      { t: 'Jenkins 官方文档', u: 'https://www.jenkins.io/doc/', d: 'Pipeline 语法、插件、分布式构建。', type: '官方文档' },
      { t: 'Prometheus 官方文档', u: 'https://prometheus.io/docs/introduction/overview/', d: '架构、PromQL、告警规则、服务发现。', type: '官方文档' },
      { t: 'Prometheus 中文文档', u: 'https://prometheus.ac.cn/docs/prometheus/latest/getting_started/', d: '中文入门，适合先跑通再深入。', type: '官方文档' },
      { t: 'Zabbix 官方手册', u: 'https://www.zabbix.com/documentation/current/en/manual', d: '模板、触发器、自动发现，传统监控体系的核心文档。', type: '官方文档' },
      { t: 'Grafana 官方文档', u: 'https://grafana.com/docs/', d: '面板、变量、告警、数据源配置。', type: '官方文档' },
      { t: 'Elastic 官方文档', u: 'https://www.elastic.co/guide/index.html', d: 'ES/Logstash/Kibana/Beats 全栈文档，含 ILM 与集群运维。', type: '官方文档' },
      { t: 'Elastic Stack 中文站', u: 'https://www.elastic.co/cn/elastic-stack/', d: '中文产品介绍与用例，向客户/领导讲方案时好用。', type: '官方文档' },
      { t: '阿里云帮助中心', u: 'https://help.aliyun.com/', d: 'ECS/SLB/RDS/VPC 的配置与故障排查文档，云上实施必查。', type: '官方文档' },
      { t: '腾讯云文档中心', u: 'https://cloud.tencent.com/document/product', d: '同类云产品文档，跨云项目时对照查阅。', type: '官方文档' },
      { t: 'VMware 官方文档', u: 'https://docs.vmware.com/', d: 'vSphere/ESXi/vCenter 的安装、集群、HA/DRS 配置。', type: '官方文档' },
      { t: 'Windows Server 文档', u: 'https://learn.microsoft.com/zh-cn/windows-server/', d: 'AD、DNS、IIS、Hyper-V，做企业内网实施绕不开。', type: '官方文档' },
      { t: 'Pro Git（中文）', u: 'https://git-scm.com/book/zh/v2', d: '版本控制从入门到分支模型，团队协作基础。', type: '官方文档' },
      { t: 'Python 3 中文文档', u: 'https://docs.python.org/zh-cn/3/', d: '运维脚本、自动化工具开发的主力语言。', type: '官方文档' },
      { t: 'ITIL 官方（AXELOS）', u: 'https://www.axelos.com/best-practice-solutions/itil', d: 'IT 服务管理框架：事件、问题、变更、配置管理，实施交付的方法论底座。', type: '官方文档' },
      { t: 'Red Hat Ansible 学习中心', u: 'https://www.redhat.com/zh-cn/technologies/management/ansible/learn', d: '体系化的自动化学习路径与实验。', type: '官方文档' },
      { t: 'TCP 协议规范 RFC 793', u: 'https://www.rfc-editor.org/rfc/rfc793.html', d: '三次握手、四次挥手、状态机的原始定义，面试答"标准答案"的出处。', type: '官方文档' }
    ]
  },
  {
    name: '二、Linux 与操作系统：从入门到系统管理',
    items: [
      { t: '运维派《Linux 学习路线》', u: 'https://www.yunweipai.com/archives/44622', d: '国内运维社区给出的分阶段学习路线，适合对照本站路径做补充。', type: '教程' },
      { t: '菜鸟教程 Linux', u: 'https://www.runoob.com/linux/linux-tutorial.html', d: '命令速查型教程，零基础起步时用来快速过一遍常用命令。', type: '教程' },
      { t: 'CSDN《Linux 入门教程（非常详细）》', u: 'https://blog.csdn.net/bigbangbangbang1/article/details/131575669', d: '中文长文，覆盖目录结构、权限、用户、软件包管理。', type: '教程' },
      { t: '鸟哥的 Linux 私房菜', u: 'https://linux.vbird.org/', d: '经典中文教材，讲原理讲得透（磁盘、权限、Shell、架站）。', type: '教程' },
      { t: 'Linux 命令大全（LinuxCool）', u: 'https://www.linuxcool.com/', d: '按命令查用法与实例，值班时随手查。', type: '教程' },
      { t: 'TLDP《Advanced Bash-Scripting Guide》', u: 'https://tldp.org/LDP/abs/html/', d: 'Shell 脚本进阶：数组、函数、陷阱、文本处理，写运维脚本的宝库。', type: '教程' },
      { t: 'CSDN《Linux 运维面试题附答案》', u: 'https://blog.csdn.net/qq_43753178/article/details/107296686', d: '常见 Linux 运维面试题集合，可与本站题库对照补漏。', type: '面试' }
    ]
  },
  {
    name: '三、计算机网络：协议与排障',
    items: [
      { t: '小林 coding · 计算机网络面试题', u: 'https://xiaolincoding.com/interview/network.html', d: '图解 TCP/IP、HTTP、HTTPS，国内网络面试口碑最好的系列之一。', type: '面试' },
      { t: '博客园《网络协议面试题（史上最全）》', u: 'https://www.cnblogs.com/crazymakercircle/p/14370335.html', d: '题量大、覆盖广，适合面试前集中刷一遍。', type: '面试' },
      { t: '阿里云开发者《HTTPS、TCP/IP、Socket 通信、三次握手四次挥手》', u: 'https://developer.aliyun.com/article/742739', d: '把握手/挥手与 HTTPS 加密流程串起来讲，适合建立整体图景。', type: '教程' }
    ]
  },
  {
    name: '四、数据库与中间件',
    items: [
      { t: '菜鸟教程 MySQL', u: 'https://www.runoob.com/mysql/mysql-tutorial.html', d: 'SQL 语法速查，建表、查询、索引入门。', type: '教程' },
      { t: '菜鸟教程 Redis', u: 'https://www.runoob.com/redis/redis-tutorial.html', d: '五种基础类型与常用命令的入门速查。', type: '教程' },
      { t: '知乎《一文搞懂 Redis 的所有知识点》', u: 'https://zhuanlan.zhihu.com/p/663851226', d: '持久化、集群、缓存问题的系统性梳理。', type: '教程' },
      { t: 'JavaGuide《MySQL 备份与恢复》', u: 'https://javaguide.cn/database/mysql/mysql-backup-and-restore.html', d: 'mysqldump、XtraBackup、binlog 与 PITR 的完整实践，运维直接可用。', type: '实战' },
      { t: '墨天轮《MySQL 面试宝典 · 主从复制篇》', u: 'https://www.modb.pro/db/390317', d: 'DBA 社区的主从复制专题，延迟与故障处理讲得细。', type: '面试' },
      { t: 'CSDN《MySQL 主从架构、读写分离、集群面试问题》', u: 'https://blog.csdn.net/weixin_36586564/article/details/124867890', d: '面试高频：主从原理、延迟、MHA/MGR 选型。', type: '面试' },
      { t: 'CoderMast · MySQL 面试题', u: 'https://www.codermast.com/interview/mysql', d: '结构化题库，按知识点分类，便于按模块复习。', type: '面试' },
      { t: '博客园《Nginx 性能优化》', u: 'https://www.cnblogs.com/luxiaoxun/p/14268248.html', d: 'worker、连接数、缓冲、长连接的系统调优实践。', type: '实战' },
      { t: 'F5《Tuning NGINX for Performance》', u: 'https://www.f5.com/company/blog/nginx/tuning-nginx', d: 'Nginx 官方维护者视角的性能调优清单，权威度高。', type: '实战' }
    ]
  },
  {
    name: '五、容器 · 云原生 · 自动化与 CI/CD',
    items: [
      { t: '美团技术团队《Kubernetes 集群管理实践》', u: 'https://tech.meituan.com/2019/08/22/kubernetes-cluster-management-practice.html', d: '大规模集群的容量、调度、稳定性治理经验，面试聊 K8s 时的加分素材。', type: '实战' },
      { t: '京东云《京东 K8s 全球最大集群实践》', u: 'https://developer.jdcloud.com/article/1160', d: '超大规模集群的架构与踩坑，理解"规模带来的问题"。', type: '实战' }
    ]
  },
  {
    name: '六、监控 · 日志 · 可观测性',
    items: [
      { t: 'CSDN《ELK 入门——ELK 详细介绍》', u: 'https://blog.csdn.net/Netceor/article/details/114653892', d: 'ELK 组件职责与数据流，从零理解日志平台。', type: '教程' },
      { t: 'CSDN《从零搭建 ELK 日志监控分析平台》', u: 'https://blog.csdn.net/zkc7441976/article/details/115868050', d: '带步骤的部署实战，可直接照做一套实验环境。', type: '实战' },
      { t: '阿里云开发者《Prometheus 与 Grafana 监控告警体系》', u: 'https://developer.aliyun.com/article/1634311', d: '指标采集、告警规则、看板搭建的完整链路。', type: '实战' },
      { t: '腾讯云《基于 Prometheus 与 Grafana 构建实时监控告警》', u: 'https://cloud.tencent.com/developer/article/2499666', d: '含 Alertmanager 配置与常见坑，适合落地时对照。', type: '实战' }
    ]
  },
  {
    name: '七、故障排查与性能分析',
    items: [
      { t: '阿里云《诊断与定位 Linux 实例 CPU/内存/IO 瓶颈》', u: 'https://help.aliyun.com/zh/ecs/support/query-and-analysis-of-system-loads-on-linux-instances', d: '云厂商官方排障手册，命令 + 判读标准都给全了。', type: '实战' },
      { t: '博客园 於清樂《Linux 性能监控与故障排查》', u: 'https://www.cnblogs.com/kirito-c/p/12153479.html', d: '从 top/vmstat/iostat 到具体案例的体系化梳理。', type: '实战' },
      { t: '腾讯云《CPU 内存不高但负载高排查指南》', u: 'https://cloud.tencent.com/developer/article/2605275', d: '专治"负载高但 CPU 闲"这类经典疑难，讲 D 状态进程与 IO 等待。', type: '实战' },
      { t: 'MS Learn《在 Linux 中排查性能问题并隔离瓶颈》', u: 'https://learn.microsoft.com/zh-cn/troubleshoot/azure/virtual-machines/linux/troubleshoot-performance-bottlenecks-linux', d: '结构化的分层排查流程（CPU/内存/磁盘/网络），适合做排障检查表。', type: '实战' }
    ]
  },
  {
    name: '八、安全与合规（等保 2.0）',
    items: [
      { t: 'CN-SEC《等保 2.0 测评指导书二级与三级对比》', u: 'https://cn-sec.com/archives/1218956.html', d: '二三级控制项差异对照，做等保项目时最实用的一份。', type: '规范' },
      { t: 'CSDN《等保 2.0 实战（上）》', u: 'https://blog.csdn.net/oldmao_2001/article/details/106230021', d: '把标准条文翻译成可落地的加固动作。', type: '规范' },
      { t: '华为云《等保 2.0 三级要求 — 安全运维管理》', u: 'https://www.huaweicloud.com/guide/productsdesc-bms_db3ae1551f9346aab02c53eecde88b70support19', d: '云上等保合规的具体要求与对应产品能力。', type: '规范' }
    ]
  },
  {
    name: '九、实施交付与项目管理',
    items: [
      { t: 'CSDN《软件实施工程师的经验之谈（适合新手）》', u: 'https://blog.csdn.net/weixin_43893935/article/details/87286081', d: '实施岗的真实工作内容、沟通技巧与避坑经验。', type: '教程' }
    ]
  },
  {
    name: '十、面试题库与职业发展',
    items: [
      { t: '见效简历《运维/DevOps 工程师简历怎么写》', u: 'https://www.jxjianli.com/guides/devops-resume-guide', d: '运维简历的项目描述范式与关键词。', type: '面试' },
      { t: '《5 年经验运维工程师简历怎么写》', u: 'https://maobucv.com/articles/2025/09/478/', d: '进阶岗位的简历结构与亮点提炼思路。', type: '面试' },
      { t: '面灵 AI《STAR 法则写简历》', u: 'https://www.mianlingai.com/blog/star-method-resume-writing-guide', d: '用 STAR 把"做过"写成"做成了什么"，行为面试也能复用。', type: '面试' }
    ]
  }
];
