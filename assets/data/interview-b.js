/* 面试题库 · 第二部分：数据库 / 缓存 / 中间件 */
window.QUESTIONS = (window.QUESTIONS || []).concat([
  /* ================= MySQL ================= */
  { id: 41, mod: '数据库', diff: '初级', q: 'MySQL 默认存储引擎是什么？InnoDB 和 MyISAM 的区别？', tags: ['InnoDB', '事务'],
    a: '<ul class="clean"><li>5.5 之后默认 InnoDB：支持事务、行级锁、外键、崩溃恢复（redo log）、MVCC。</li><li>MyISAM：表级锁、不支持事务、索引与数据分离、count(*) 快但不安全，已被淘汰。</li><li>选型结论：生产一律 InnoDB；临时表/只读静态表场景才可能见到 MyISAM。</li></ul>' },

  { id: 42, mod: '数据库', diff: '中级', q: '为什么 MySQL 索引用 B+ 树而不是 B 树或哈希？', tags: ['索引', 'B+树'],
    a: '<ul class="clean"><li>B+ 树非叶子节点只存键、不存数据，同样磁盘页能容纳更多索引项，树更矮（一般 3~4 层），IO 更少。</li><li>叶子节点用链表串起来，天然支持范围查询与排序（order by / between）。</li><li>哈希索引只支持等值查询、不支持范围与排序，且有哈希冲突。</li><li>InnoDB 还有自适应哈希索引（AHI）自动优化热点等值查询。</li></ul>' },

  { id: 43, mod: '数据库', diff: '中级', q: '什么是聚簇索引和回表？覆盖索引怎么优化？', tags: ['聚簇索引', '回表', '覆盖索引'],
    a: '<ul class="clean"><li>InnoDB 主键索引即聚簇索引，叶子存整行数据；二级索引叶子存主键值。</li><li>通过二级索引查非索引列，需要拿主键再回主键索引查一次 → 回表，多一次随机 IO。</li><li>覆盖索引：查询列都在索引里，Using index，无需回表。</li><li>实践：把高频查询条件+返回列做成联合索引；避免 <code>select *</code>。</li></ul>',
    cmd: 'EXPLAIN SELECT id,name FROM users WHERE phone=\'13800000000\';' },

  { id: 44, mod: '数据库', diff: '中级', q: '什么情况下索引会失效？', tags: ['索引失效'],
    a: '<ul class="clean"><li>对索引列做函数/运算/隐式类型转换（字符串列传数字）。</li><li>前导模糊 <code>like \'%abc\'</code>；联合索引不满足最左前缀。</li><li>OR 连接的条件中有列无索引；不等于 <code>!=</code>、<code>not in</code> 可能导致全表扫描。</li><li>优化器估算走索引更慢（区分度低、回表多）时会主动放弃索引——这时该考虑覆盖索引或改查询。</li></ul>' },

  { id: 45, mod: '数据库', diff: '中级', q: '事务的隔离级别有哪些？分别解决什么问题？', tags: ['事务', '隔离级别', 'MVCC'],
    a: '<ul class="clean"><li>读未提交（脏读）、读已提交（不可重复读）、可重复读（幻读，MySQL 默认）、串行化。</li><li>InnoDB 在 RR 下用 MVCC（undo log + 版本链 + ReadView）+ 间隙锁在很大程度上解决幻读。</li><li>RC 与 RR 的差异影响 binlog 格式与主从一致性，线上改隔离级别要评估。</li><li>长事务会导致 undo 膨胀与锁等待，监控 trx 超过 60s 就要关注。</li></ul>' },

  { id: 46, mod: '数据库', diff: '高级', q: '讲讲 MySQL 的锁：行锁、间隙锁、MDL，死锁怎么排查？', tags: ['锁', '死锁', 'MDL'],
    a: '<ul class="clean"><li>InnoDB 行锁基于索引实现，没走索引会退化为锁全表记录（近似表锁）。</li><li>间隙锁（Gap Lock）+ 临键锁用于 RR 防幻读，代价是并发插入冲突。</li><li>MDL 元数据锁：DDL 等 MDL 排他锁，被长事务阻塞，后续所有查询排队 → "改个字段把库搞挂"。</li><li>死锁排查：<code>SHOW ENGINE INNODB STATUS</code> 看 LATEST DETECTED DEADLOCK，按固定顺序访问表、缩短事务、加合适索引。</li></ul>' },

  { id: 47, mod: '数据库', diff: '高级', q: 'MySQL 主从复制的原理？主从延迟怎么解决？', tags: ['主从', '复制', 'GTID'],
    a: '<ul class="clean"><li>主库写 binlog → dump 线程发给从库 → 从库 IO 线程写入 relay log → SQL 线程回放。</li><li>延迟原因：大事务（拆批）、从库单线程回放（开并行复制）、从库配置差/被查询压垮、网络。</li><li>监控 <code>Seconds_Behind_Master</code> 不总准，更可靠看 GTID 位点差与心跳表。</li><li>业务侧：强一致读走主库、读写分离加"写后读主"策略、延迟过大自动摘除从库。</li></ul>',
    cmd: 'SHOW REPLICA STATUS\\G\nSHOW BINARY LOGS;' },

  { id: 48, mod: '数据库', diff: '中级', q: '一条 SQL 很慢，你的优化步骤是什么？', tags: ['慢查询', '优化'],
    a: '<ul class="clean"><li>确认是偶发还是持续：查慢查询日志、<code>SHOW PROCESSLIST</code> 看是否锁等待。</li><li>EXPLAIN 看 type/key/rows/Extra，判断是否全表扫描、临时表、文件排序。</li><li>优化：加/改索引（联合索引顺序、覆盖索引）、改写 SQL（避免函数、分页深翻用游标）、拆大查询。</li><li>仍慢再看表设计（大字段、分区）、参数（buffer pool）、数据量（归档/分库分表）。</li></ul>' },

  { id: 49, mod: '数据库', diff: '中级', q: '深分页 limit 1000000,10 为什么慢？怎么优化？', tags: ['分页', '优化'],
    a: '<ul class="clean"><li>MySQL 要扫描并丢弃前 100 万行，回表代价巨大。</li><li>方案一：延迟关联——先用覆盖索引取 id，再 join 回表：<code>select * from t join (select id from t order by id limit 1000000,10) x using(id)</code>。</li><li>方案二：游标分页（记住上次最大 id）：<code>where id &gt; last_id order by id limit 10</code>，最快但只能顺序翻页。</li><li>业务侧限制最大页数或改用搜索引擎/导出。</li></ul>' },

  { id: 50, mod: '数据库', diff: '中级', q: '数据库备份方式有哪些？怎么做到恢复到任意时间点？', tags: ['备份', 'binlog', 'PITR'],
    a: '<ul class="clean"><li>逻辑备份 mysqldump（可读、慢、锁表风险，<code>--single-transaction</code> 可减少锁）、物理备份 XtraBackup（快、适合大库）。</li><li>PITR（时间点恢复）：全备 + 增量 + binlog。恢复全备后，用 <code>mysqlbinlog --start-datetime</code> 重放到目标时刻。</li><li>前提：<code>log_bin=ON</code>、<code>binlog_format=ROW</code>、binlog 保留期足够。</li><li>定期演练并记录 RTO，否则事故时才发现备份不可用。</li></ul>',
    cmd: 'mysqldump --single-transaction --routines --triggers --master-data=2 db > db.sql\nmysqlbinlog --stop-datetime="2024-05-01 10:30:00" mysql-bin.000012 | mysql -uroot -p' },

  { id: 51, mod: '数据库', diff: '高级', q: '磁盘满了导致 MySQL 无法写入，怎么应急？', tags: ['故障', '磁盘', 'binlog'],
    a: '<ul class="clean"><li>先止血：停掉非核心写入/暂停日志类业务，避免彻底挂死。</li><li>清理：旧 binlog（<code>PURGE BINARY LOGS BEFORE ...</code>，注意主从依赖）、慢日志、临时文件、旧备份。</li><li>扩盘：云盘在线扩容 + 文件系统扩容（LVM）。</li><li>事后：数据盘与日志盘分离、磁盘水位告警（80% 预警、90% 严重）、binlog 保留策略。</li></ul>' },

  { id: 52, mod: '数据库', diff: '中级', q: 'MySQL 连接数打满（Too many connections）怎么处理？', tags: ['连接数'],
    a: '<ul class="clean"><li>应急：用 root 本地 socket 登录 → 杀掉 Sleep 超长连接 (<code>pt-kill</code> 或循环 KILL) → 临时调大 <code>max_connections</code>。</li><li>根因：应用连接池泄漏、慢 SQL 堆积、未及时 close、连接池上限 > 数据库上限。</li><li>治理：连接池与 DB 上限匹配（总数 = 池大小 × 实例数 &lt; max_connections 的 80%）、设置 <code>wait_timeout</code>、加连接数监控。</li></ul>' },

  { id: 53, mod: '数据库', diff: '初级', q: 'char 和 varchar 的区别？utf8 和 utf8mb4 的区别？', tags: ['字符集', '类型'],
    a: '<ul class="clean"><li>char 定长（不足补空格）、适合短固定长度（如身份证、MD5）；varchar 变长 + 长度前缀，省空间但更新可能产生页分裂。</li><li>utf8 在 MySQL 中最多 3 字节，存不了 emoji 与部分生僻字；utf8mb4 是完整 UTF-8（4 字节），新系统一律 utf8mb4。</li><li>迁移注意：索引长度限制、排序规则（collation）一致性、连接字符集要同步设置。</li></ul>' },

  { id: 54, mod: '数据库', diff: '中级', q: '为什么建议使用自增主键而不是 UUID？', tags: ['主键', '页分裂'],
    a: '<ul class="clean"><li>InnoDB 聚簇索引按主键顺序存储，自增主键顺序写入，减少页分裂与随机 IO。</li><li>UUID 无序且长（36 字节），导致 B+ 树频繁分裂、缓存命中低、二级索引变大。</li><li>分布式场景替代方案：雪花算法（有序趋势递增）、号段模式。</li></ul>' },

  /* ================= Redis ================= */
  { id: 55, mod: '数据库', diff: '初级', q: 'Redis 有哪些数据类型？各自适用场景？', tags: ['Redis', '数据类型'],
    a: '<ul class="clean"><li>String（缓存、计数、分布式锁）、Hash（对象属性）、List（队列、时间线）、Set（去重、交并集）、ZSet（排行榜、延时队列）。</li><li>扩展：Bitmap（签到）、HyperLogLog（UV 估算）、GEO（附近的人）、Stream（消息流）。</li><li>选型原则：按访问模式选，不要用 String 存整个大对象再整体读写。</li></ul>' },

  { id: 56, mod: '数据库', diff: '中级', q: 'Redis 持久化 RDB 和 AOF 怎么选？混合持久化是什么？', tags: ['RDB', 'AOF', '持久化'],
    a: '<ul class="clean"><li>RDB：定时快照，文件小、恢复快，但可能丢最后一次快照后的数据；fork 时写时复制，内存大时 fork 有抖动。</li><li>AOF：追加写命令，<code>appendfsync everysec</code> 最多丢 1 秒；文件大、恢复慢，需要重写（rewrite）压缩。</li><li>混合持久化（4.0+）：AOF 重写时前半段用 RDB 格式，兼顾恢复速度与数据完整。</li><li>生产建议：开 AOF everysec（或混合），RDB 做冷备；纯缓存场景可以只留 RDB 或不持久化。</li></ul>' },

  { id: 57, mod: '数据库', diff: '中级', q: '缓存穿透、击穿、雪崩分别是什么？怎么解决？', tags: ['缓存', '穿透', '雪崩'],
    a: '<ul class="clean"><li><b>穿透</b>：查不存在的数据，缓存不命中直接打 DB。方案：布隆过滤器、空值缓存（短 TTL）、参数校验。</li><li><b>击穿</b>：热点 key 过期瞬间大量并发打 DB。方案：互斥锁重建、逻辑过期 + 异步刷新、热点 key 预热且不设过期。</li><li><b>雪崩</b>：大量 key 同时失效或 Redis 整体不可用。方案：过期时间加随机、多级缓存、限流熔断降级、Redis 集群高可用。</li><li>三者常混，回答时务必先给定义再给对应方案。</li></ul>',
    tip: '这题是区分"背过"和"想过"的分水岭，最好配一个你实际处理过的例子。' },

  { id: 58, mod: '数据库', diff: '中级', q: '缓存和数据库的一致性怎么保证？', tags: ['缓存一致性', 'Cache Aside'],
    a: '<ul class="clean"><li>Cache Aside：读先读缓存、未命中读库回填；写先更新库再删除缓存（不是更新缓存）。</li><li>仍有并发窗口，可用延迟双删（更新后 500ms 再删一次），但本质是最终一致。</li><li>强一致需求：订阅 binlog（Canal）异步失效缓存、或把缓存当主存储做写穿透。</li><li>接受最终一致时要给业务上层兜底（如读旧数据不引发资损）。</li></ul>' },

  { id: 59, mod: '数据库', diff: '高级', q: 'Redis 内存满了会怎样？淘汰策略怎么选？', tags: ['maxmemory', '淘汰'],
    a: '<ul class="clean"><li>没设 maxmemory 会一直吃内存直至被 OOM Killer 杀；设了之后按策略淘汰，写请求可能报 OOM command not allowed。</li><li>策略：noeviction（默认，拒绝写）、allkeys-lru/lfu、volatile-lru/lfu/ttl、random 系列。</li><li>纯缓存用 allkeys-lru（或 lfu 应对热点）；有重要数据不能丢的用 volatile-* 或 noeviction + 扩容。</li><li>同时治理 bigkey/hotkey：<code>redis-cli --bigkeys</code>、<code>--hotkeys</code>（需 LFU）。</li></ul>' },

  { id: 60, mod: '数据库', diff: '高级', q: 'Redis 主从/Sentinel/Cluster 的差别？Cluster 的槽位机制？', tags: ['主从', '哨兵', 'Cluster'],
    a: '<ul class="clean"><li>主从：数据冗余 + 读写分离，主挂了需人工切。</li><li>Sentinel：监控 + 自动故障转移 + 通知，解决高可用，容量仍单机。</li><li>Cluster：16384 个槽分片到多个主节点，支持水平扩容；客户端按 key 计算 CRC16 路由，跨槽操作受限（可用 hash tag）。</li><li>Cluster 至少 3 主 3 从；扩容需迁移槽（reshard），注意大 key 迁移阻塞。</li></ul>' },

  /* ================= 中间件 ================= */
  { id: 61, mod: '中间件', diff: '初级', q: 'Nginx 有哪些作用？正向代理和反向代理的区别？', tags: ['Nginx', '反向代理'],
    a: '<ul class="clean"><li>作用：静态资源服务、反向代理、负载均衡、缓存、限流、SSL 卸载、灰度路由。</li><li>正向代理代表客户端（翻墙/公司统一出口），服务端不知道真实客户端；反向代理代表服务端（用户不知道真实后端）。</li><li>Nginx 事件驱动（epoll）异步非阻塞，单机可扛数万并发连接。</li></ul>' },

  { id: 62, mod: '中间件', diff: '中级', q: 'Nginx 的 master/worker 模型？worker 数怎么配？', tags: ['Nginx', '进程模型'],
    a: '<ul class="clean"><li>master 负责读配置、管理 worker、平滑升级；worker 处理连接，各自独立、无锁竞争。</li><li>worker_processes 一般设为 CPU 核数（auto），配合 worker_cpu_affinity 绑核。</li><li>worker_connections 是单 worker 最大连接数，最大并发 ≈ worker_processes × worker_connections / 2（反向代理双向计数）。</li><li>还要调 <code>worker_rlimit_nofile</code> 与系统 ulimit 一致。</li></ul>' },

  { id: 63, mod: '中间件', diff: '中级', q: 'Nginx 502 和 504 分别是什么原因？怎么排查？', tags: ['502', '504', '排障'],
    a: '<ul class="clean"><li>502 Bad Gateway：上游无响应/返回非法响应——进程没起、端口不通、PHP-FPM 挂、上游主动断开、缓冲区太小。</li><li>504 Gateway Timeout：上游处理超时——<code>proxy_read_timeout</code> 太短、后端慢查询/GC 卡顿、连接池耗尽。</li><li>排查：error.log 具体行 → upstream 是否健康 → 后端应用日志与线程栈 → 耗时定位（看 <code>upstream_response_time</code>）。</li><li>别只调大超时了事，要找到后端为什么慢。</li></ul>' },

  { id: 64, mod: '中间件', diff: '中级', q: 'Nginx 常用的负载均衡策略和健康检查怎么做？', tags: ['负载均衡', '健康检查'],
    a: '<ul class="clean"><li>策略：round-robin（默认）、weight、ip_hash、least_conn、hash $key（一致性哈希）。</li><li>开源版健康检查弱：可用 <code>max_fails</code> + <code>fail_timeout</code> 被动摘除；主动探测需 nginx plus 或 OpenResty/淘宝模块。</li><li>另类做法：用 upstream 的 backup 做兜底，或在 LB 前置 DNS/ELB 健康检查。</li></ul>',
    cmd: 'upstream app {\n  least_conn;\n  server 10.0.0.1:8080 max_fails=2 fail_timeout=10s;\n  server 10.0.0.2:8080 backup;\n  keepalive 64;\n}' },

  { id: 65, mod: '中间件', diff: '中级', q: 'Nginx 如何做限流？limit_req 和 limit_conn 的区别？', tags: ['限流', 'Nginx'],
    a: '<ul class="clean"><li>limit_req：按速率限流（漏桶），<code>rate=10r/s burst=20 nodelay</code>，适合接口防刷。</li><li>limit_conn：限制并发连接数（如单 IP 同时 10 个连接），适合下载/大文件。</li><li>两者的 key 用 <code>$binary_remote_addr</code>（省内存）；超限返回 503，可用 <code>limit_req_status</code> 自定义。</li><li>分布式场景要网关/Redis 做全局限流，单机 Nginx 只管本机。</li></ul>' },

  { id: 66, mod: '中间件', diff: '高级', q: 'Nginx 性能优化的常见手段？', tags: ['性能优化', 'Nginx'],
    a: '<ul class="clean"><li>系统层：ulimit、somaxconn、tcp_tw_reuse、文件系统与网卡参数。</li><li>Nginx 层：worker_processes/affinity、worker_connections、keepalive 长连接（与上游也要配 keepalive + proxy_http_version 1.1）、sendfile、gzip。</li><li>代理层：proxy_buffering、缓冲区大小、超时设置、upstream keepalive。</li><li>静态资源交给 CDN/对象存储，动态请求做缓存（proxy_cache / fastcgi_cache）。</li></ul>' },

  { id: 67, mod: '中间件', diff: '中级', q: 'Tomcat 的 Connector 和线程池怎么调优？', tags: ['Tomcat', 'JVM'],
    a: '<ul class="clean"><li>Connector 关键参数：maxThreads（默认 200）、minSpareThreads、acceptCount（队列）、maxConnections、connectionTimeout。</li><li>线程数不等于越高越好：受下游 DB/RPC 与 CPU 限制，需压测找拐点。</li><li>开启 NIO/NIO2（默认 NIO），keepAlive 与压缩按需开。</li><li>日志切割（catalina.out 无限增长是经典坑）。</li></ul>' },

  { id: 68, mod: '中间件', diff: '高级', q: 'Java 应用频繁 Full GC 怎么排查？', tags: ['JVM', 'GC'],
    a: '<ul class="clean"><li>先看现象：<code>jstat -gcutil &lt;pid&gt; 1000</code>，观察 O 区是否回收不掉、FGC 次数与耗时。</li><li>开 GC 日志（-Xlog:gc* 或 -XX:+PrintGCDetails），加 <code>-XX:+HeapDumpOnOutOfMemoryError</code>。</li><li>dump 分析（MAT/jvisualvm）：大对象、集合无界增长、缓存未设上限、ThreadLocal 泄漏。</li><li>应急可扩堆或重启，但根因在代码/缓存策略；长期做压测与容量规划。</li></ul>',
    cmd: 'jstat -gcutil 12345 1000 10\njcmd 12345 GC.heap_dump /tmp/heap.hprof\njmap -histo:live 12345 | head -20' },

  { id: 69, mod: '中间件', diff: '高级', q: 'Kafka 为什么快？ISR 和 acks 是什么？', tags: ['Kafka', 'ISR'],
    a: '<ul class="clean"><li>顺序写磁盘 + 页缓存 + sendfile 零拷贝 + 批量压缩 + 分区并行。</li><li>ISR：与 leader 保持同步的副本集合，<code>min.insync.replicas</code> 限制最少同步副本数。</li><li>acks=0 不等确认（可能丢）、acks=1 leader 写入即返回（leader 挂可能丢）、acks=all 需 ISR 全部确认（最安全）。</li><li>消费者 offset 提交与重复消费：至少一次语义，业务要做幂等。</li></ul>' },

  { id: 70, mod: '中间件', diff: '中级', q: '消息队列的作用？如何保证不丢消息、不重复消费？', tags: ['MQ', '幂等'],
    a: '<ul class="clean"><li>作用：解耦、削峰填谷、异步、最终一致（分布式事务）。</li><li>不丢：生产端确认（acks/confirm）+ 持久化 + 副本 + 消费端手动 ack 且处理成功才提交 + 死信队列兜底。</li><li>不重复消费：业务幂等（唯一键、状态机、去重表）。MQ 一般保证 at-least-once，重复是常态。</li><li>顺序：同一分区/队列内有序，需按业务 key 路由到同一分区。</li></ul>' },

  { id: 71, mod: '中间件', diff: '中级', q: '消息积压了几百万条，怎么处理？', tags: ['消息积压'],
    a: '<ul class="clean"><li>先判断原因：消费者挂了/变慢（下游 DB 慢、GC）、生产突增、分区数不足。</li><li>应急扩容消费者（分区数决定并行上限，必要时先扩分区），临时提升批量拉取与并发。</li><li>若下游扛不住，先旁路落盘（转存到临时 topic/DB），事后补偿消费。</li><li>兜底：监控 lag 告警、消费者自动扩容、限流保护下游。</li></ul>' },

  { id: 72, mod: '中间件', diff: '中级', q: 'Tomcat 部署时 8080 端口起了但访问 404/502，怎么查？', tags: ['Tomcat', '部署'],
    a: '<ul class="clean"><li>404：应用没部署成功或 context path 不对（war 名即路径），看 catalina.out 有无部署异常。</li><li>502：Nginx 到 Tomcat 不通 → 检查 <code>proxy_pass</code> 地址、Tomcat 是否监听 0.0.0.0、防火墙。</li><li>看 <code>ss -lntp | grep 8080</code> 确认监听地址，<code>curl -I http://127.0.0.1:8080/</code> 本地验证。</li><li>还可能是 SELinux 阻止 Nginx 连后端（<code>setsebool -P httpd_can_network_connect 1</code>）。</li></ul>' }
]);
