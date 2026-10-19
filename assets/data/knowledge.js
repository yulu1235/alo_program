/* 知识点数据：系统实施运维全栈知识地图
   字段：name 模块名 / icon 图标 / desc 一句话 / items 知识点
   item: { t 标题, lv 级别(必会|进阶|加分), must 是否高频, d 要点数组, cmd 常用命令 } */
window.MODULES = [
  {
    name: '计算机与操作系统基础',
    icon: '💻',
    desc: '所有上层技术的底座，面试第一道分水岭',
    items: [
      {
        t: 'CPU 与进程调度', lv: '必会', must: true,
        d: [
          '进程 vs 线程 vs 协程：资源分配单位 / CPU 调度单位 / 用户态轻量线程，上下文切换代价依次降低',
          '进程状态：R 运行、S 可中断睡眠、D 不可中断（IO 等待，负载高的元凶）、Z 僵尸、T 停止',
          'CFS 调度与 nice 值（-20~19）、CPU 亲和性 <code>taskset</code>、cgroup 的 cpu.shares 限制',
          '上下文切换次数用 <code>vmstat 1</code> 的 cs 列、<code>pidstat -w</code> 观察，过高说明锁竞争或线程过多'
        ],
        cmd: 'top -Hp <pid>\nvmstat 1 5\npidstat -w -p <pid> 1'
      },
      {
        t: '内存管理与 OOM', lv: '必会', must: true,
        d: [
          '虚拟内存/物理内存、页表、TLB；Linux 的 buff/cache 可回收，判断可用内存看 <code>available</code> 而非 <code>free</code>',
          'swap 的作用与取舍：数据库、ES 建议 <code>vm.swappiness=1</code> 甚至关闭，避免抖动',
          'OOM Killer 依据 <code>oom_score</code> 选进程，可调 <code>oom_score_adj</code>；容器内 OOM 会直接 kill 主进程，表现为 137 退出码',
          '常见泄漏排查链路：RSS 持续上涨 → pmap / jmap / pstack → 定位对象或内存映射'
        ],
        cmd: 'free -h\ncat /proc/meminfo\nps aux --sort=-%mem | head\ncat /proc/<pid>/status | grep VmRSS'
      },
      {
        t: '磁盘 IO 与文件描述符', lv: '必会', must: true,
        d: [
          '机械盘/SSD/NVMe 的 IOPS 与吞吐差异；顺序写远快于随机写（这也是 WAL/binlog 的设计动机）',
          'IO 调度器 noop / deadline / mq-deadline / kyber，SSD 与虚拟化场景常用 none',
          '文件描述符上限 <code>ulimit -n</code>、<code>/proc/sys/fs/file-max</code>，Nginx/MySQL 高并发必调',
          'IO 等待看 <code>iostat -x 1</code> 的 %util、await、aqu-sz；<code>iotop</code> 定位具体进程'
        ],
        cmd: 'iostat -x 1\niotop -oP\ndf -hT\ndf -i\nlsof -p <pid> | wc -l'
      },
      {
        t: '系统启动流程', lv: '必会',
        d: [
          'BIOS/UEFI → GRUB → 内核 → initramfs → systemd(PID 1) → 各 target（multi-user / graphical）',
          'systemd 单元类型：service / socket / timer / target / mount；<code>systemctl enable --now</code>',
          'grub 救援：改内核参数（single / rd.break）、重装 grub2、修复 fstab 导致的开机失败',
          '查看启动耗时 <code>systemd-analyze blame</code>、<code>critical-chain</code>'
        ],
        cmd: 'systemctl list-units --failed\nsystemd-analyze blame\njournalctl -b -p err'
      },
      {
        t: '计算机组成与服务器硬件', lv: '必会', must: true,
        d: [
          'CPU 路数/核数/超线程、内存通道与 ECC、PCIe 通道数决定网卡与 NVMe 上限',
          'RAID 0/1/5/6/10 的容量、性能、容错取舍；RAID 卡缓存与 BBU 对写性能的影响',
          '带外管理：iDRAC / iLO / IPMI / BMC，远程开关机、KVM over IP、硬件告警日志',
          '双电源、冗余风扇、机柜 U 数与功耗（PUE）是机房交付必须核对的物理项'
        ]
      },
      {
        t: '编码、字符集与时间', lv: '进阶', must: true,
        d: [
          'UTF-8 / GBK / Latin-1：中文乱码 90% 来自编码链路不一致（终端、locale、数据库连接、HTTP 头）',
          'locale 与 <code>/etc/locale.conf</code>，容器内常见 <code>LANG=C</code> 导致中文输出异常',
          '时区：系统 <code>timedatectl</code>、数据库 <code>time_zone</code>、应用时区三者不一致会造成"数据晚 8 小时"',
          '时间同步：chrony/ntp，集群内偏移过大直接导致主从/选举异常'
        ],
        cmd: 'timedatectl\nlocale\nchronyc sources -v'
      }
    ]
  },
  {
    name: 'Linux 系统管理与 Shell',
    icon: '🐧',
    desc: '实施运维的吃饭手艺，命令熟练度决定交付速度',
    items: [
      {
        t: '文件系统与目录规范', lv: '必会', must: true,
        d: [
          'FHS 目录职责：/etc 配置、/var 可变数据、/usr 程序、/opt 第三方、/proc 与 /sys 内核接口',
          'ext4 / xfs 差异：xfs 不支持缩容、大文件性能好，CentOS 7+ 默认；LVM 可在其上做在线扩容',
          'inode 耗尽导致"磁盘没满却写不进去"，用 <code>df -i</code> 排查',
          '挂载与持久化：<code>/etc/fstab</code> 建议用 UUID，改错会开机进 emergency'
        ],
        cmd: 'lsblk -f\nblkid\ndf -hT\ndf -i\nmount | column -t'
      },
      {
        t: '用户、权限与提权', lv: '必会', must: true,
        d: [
          'rwx 与数字权限、umask、粘滞位（/tmp）、SUID/SGID、chattr +i 防误删',
          'sudo 精细化：<code>/etc/sudoers.d/</code> 按命令白名单授权，禁用 NOPASSWD 全域 root',
          'ACL（setfacl/getfacl）解决多用户共享目录的细粒度授权',
          '密钥登录：ssh-keygen → authorized_keys 600 → 关闭 PasswordAuthentication；跳板机与堡垒机（JumpServer）'
        ],
        cmd: 'id\nls -l\numask\nsetfacl -m u:app:rx /data\ngetfacl /data\nvisudo -c'
      },
      {
        t: '进程与服务管理', lv: '必会', must: true,
        d: [
          'systemd 单元编写：ExecStart/User/Restart=on-failure/RestartSec/WantedBy，改完 <code>daemon-reload</code>',
          '进程查杀链路：ps/top → pgrep → kill -15 优雅 → -9 强杀；僵尸进程要杀父进程',
          'nohup / screen / tmux 与守护进程的区别，生产必须托管给 systemd 或 supervisor',
          '端口与连接：<code>ss -lntp</code> 看监听、<code>ss -ant state established</code> 看连接数、TIME_WAIT 堆积调内核参数'
        ],
        cmd: 'systemctl status nginx\nss -lntp\nss -s\njournalctl -u nginx -f'
      },
      {
        t: '软件包与源管理', lv: '必会', must: true,
        d: [
          'RPM 系（yum/dnf）与 DEB 系（apt）的常用操作、本地源与内网镜像源配置（离线环境必备）',
          '依赖冲突与降级：<code>yum history</code>、<code>--nogpgcheck</code>、<code>--downloadonly</code>',
          '编译安装三步曲 ./configure && make && make install，以及 <code>ldconfig</code>、<code>PKG_CONFIG_PATH</code>',
          '离线交付：把 rpm 全量下载到本地仓库（createrepo），或直接打包成 tar 镜像'
        ],
        cmd: 'yum install -y --downloadonly --downloaddir=/opt/rpm nginx\nyum history\ndpkg -l\napt-get -f install'
      },
      {
        t: 'Shell 脚本工程化', lv: '必会', must: true,
        d: [
          '严格模式 <code>set -euo pipefail</code>、参数解析 getopts、日志函数、<code>trap</code> 清理资源',
          '文本三剑客：grep -E、sed -i 就地替换（注意备份）、awk 按列统计（日志分析高频）',
          '条件判断 [[ ]] 与 test 的坑、字符串比较、数值比较、文件测试符',
          '脚本常见事故：cd 失败继续执行、变量未加引号、rm -rf $DIR 变量为空——务必加 <code>${VAR:?}</code> 保护'
        ],
        cmd: '#!/usr/bin/env bash\nset -euo pipefail\nawk \'{print $1}\' access.log | sort | uniq -c | sort -rn | head\nsed -n \'10,20p\' file\ngrep -c "ERROR" app.log'
      },
      {
        t: '定时任务与日志', lv: '必会',
        d: [
          'cron 五段式与 <code>/etc/cron.d/</code>；systemd timer 更可靠（支持错过后补跑 Persistent=true）',
          'crond 不执行的三板斧：环境变量缺失、脚本无执行权限、路径写相对',
          '日志轮转 logrotate：size/daily、rotate 保留数、postrotate 重载进程',
          'journalctl 持久化（Storage=persistent）、按时间/单元/优先级过滤'
        ],
        cmd: 'crontab -l\nls /etc/cron.d/\nlogrotate -d /etc/logrotate.d/nginx\njournalctl --since "1 hour ago" -p err'
      },
      {
        t: '内核参数调优', lv: '进阶', must: true,
        d: [
          '文件句柄：fs.file-max、fs.nr_open、ulimit -n（要改 /etc/security/limits.d/）',
          '网络：net.core.somaxconn、net.ipv4.tcp_max_syn_backlog、tcp_tw_reuse、ip_local_port_range',
          '内存：vm.swappiness、vm.overcommit_memory（Redis 需设 1）、dirty_ratio',
          '持久化写 <code>/etc/sysctl.d/99-tuning.conf</code>，用 <code>sysctl -p</code> 生效并记录变更'
        ],
        cmd: 'sysctl -a | grep somaxconn\nsysctl -w net.core.somaxconn=65535\nulimit -n'
      },
      {
        t: 'SSH 与远程运维安全', lv: '必会', must: true,
        d: [
          'sshd_config 加固：端口、PermitRootLogin no、MaxAuthTries、AllowUsers、LoginGraceTime',
          '密钥分发与 known_hosts；scp / rsync 增量同步（<code>-avz --delete</code> 谨慎）',
          '隧道：ssh -L 本地转发、-R 远程转发、-D 动态代理，临时打通跨网段调试',
          '堡垒机审计：会话录制、命令拦截、双人复核（金融/政企项目硬性要求）'
        ],
        cmd: 'ssh -i key.pem ops@10.0.0.10\nssh -L 13306:db:3306 jump\nrsync -avz --progress src/ ops@host:/data/src/'
      }
    ]
  },
  {
    name: '计算机网络',
    icon: '🌐',
    desc: '排障 70% 的问题落在网络层，必须能"分层定位"',
    items: [
      {
        t: 'TCP/IP 分层与封装', lv: '必会', must: true,
        d: [
          '四层/七层模型对应关系、每层典型设备与协议（交换机/路由器/负载均衡/防火墙）',
          'MTU 与分片、路径 MTU 发现；VPN/隧道场景常见 MSS 问题导致"能 ping 通但打不开网页"',
          'TCP 三次握手/四次挥手、TIME_WAIT 与 CLOSE_WAIT 的成因与处置',
          '拥塞控制：慢启动、拥塞避免、快速重传；BBR 在高丢包链路提升明显'
        ],
        cmd: 'ss -ant | awk \'{print $1}\' | sort | uniq -c\nnetstat -s | grep -i retrans\nping -M do -s 1472 host'
      },
      {
        t: 'IP 规划与子网划分', lv: '必会', must: true,
        d: [
          'CIDR、掩码换算、可用主机数、广播地址——实施交付写网络方案必考',
          'VLAN 隔离与三层互通、网关/ARP、静态路由与默认路由',
          'NAT：SNAT 出网、DNAT 端口映射（发布系统最常用）、hairpin 回环问题',
          '双网卡/多网段：策略路由（ip rule）、bond/bridge 模式选择'
        ],
        cmd: 'ip a\nip r\nip route add 10.1.0.0/16 via 10.0.0.1\narp -n\ntraceroute -n 8.8.8.8'
      },
      {
        t: 'DNS 与域名解析', lv: '必会', must: true,
        d: [
          '递归/迭代查询、A/CNAME/MX/TXT/NS 记录、TTL 与生效时间、CDN 的 CNAME 接入',
          '解析排障顺序：/etc/resolv.conf → dig @8.8.8.8 → 本地 hosts → 权威 NS',
          '内网自建 DNS（bind/dnsmasq/CoreDNS），容器集群内 CoreDNS 与 ndots 配置坑',
          '域名备案、证书签发（Let\'s Encrypt / 企业 CA）、SNI 与多域名共用 443'
        ],
        cmd: 'dig +short example.com A\ndig @223.5.5.5 example.com\nnslookup example.com\ncat /etc/resolv.conf'
      },
      {
        t: 'HTTP / HTTPS 协议', lv: '必会', must: true,
        d: [
          '请求方法、状态码家族（2xx/3xx/4xx/5xx）与典型排障含义（502/504/499 最常见）',
          'HTTP/1.1 长连接与队头阻塞、HTTP/2 多路复用、HTTP/3(QUIC) 基于 UDP',
          'Header 关键项：Host、X-Forwarded-For、Cookie、Content-Type、Cache-Control、Connection',
          'TLS 握手流程、证书链、SNI、双向认证 mTLS，以及"证书过期导致全站 502"这类经典事故'
        ],
        cmd: 'curl -I https://example.com\ncurl -v -o /dev/null https://example.com\nopenssl s_client -connect example.com:443 -servername example.com\nopenssl x509 -in cert.pem -noout -dates'
      },
      {
        t: '负载均衡与四七层', lv: '必会', must: true,
        d: [
          'LVS（DR/NAT/TUN）四层转发 vs Nginx/HAProxy 七层代理，性能与功能取舍',
          '调度算法：轮询、加权、最少连接、源地址哈希、一致性哈希（会话保持）',
          '健康检查：TCP 端口 / HTTP 状态码 / 内容匹配；摘除与恢复的阈值设置',
          'VIP + keepalived（VRRP）双机主备，脑裂与抢占模式配置坑'
        ],
        cmd: 'ipvsadm -Ln\nkeepalived -t -f /etc/keepalived/keepalived.conf\nnginx -T | grep upstream -A5'
      },
      {
        t: '抓包与网络排障', lv: '进阶', must: true,
        d: [
          'tcpdump 表达式：host/port/src/dst、-i 网卡、-w 落盘、-nn 不解析、-A/-X 看内容',
          'Wireshark 分析：三次握手是否完成、有无 RST、重传、窗口为零（对端处理不过来）',
          '连通性分层排查：链路（ping）→ 端口（telnet/nc）→ 应用（curl）→ 业务（日志/链路追踪）',
          '常见故障模式：防火墙丢包（SYN 无响应）、MTU 黑洞（大包丢失）、连接数打满（accept queue overflow）'
        ],
        cmd: 'tcpdump -i eth0 -nn port 80 -w /tmp/http.pcap\ntcpdump -i any -nn "tcp[tcpflags] & tcp-rst != 0"\nnc -vz 10.0.0.1 3306\ncurl -v --resolve api.test:443:10.0.0.5 https://api.test/'
      },
      {
        t: '防火墙与安全组', lv: '必会', must: true,
        d: [
          'iptables 四表五链、规则顺序与默认策略；firewalld 的 zone 与 rich rule',
          '云上安全组 + 主机防火墙双层，双向放行（入站/出站）都要检查',
          '端口开放最小化原则、限制来源 IP 段、临时放行要有回收机制',
          'NAT 与 DNAT 规则持久化（iptables-save / netfilter-persistent）'
        ],
        cmd: 'iptables -L -n -v --line-numbers\nfirewall-cmd --list-all\nfirewall-cmd --add-port=8080/tcp --permanent\niptables-save > /etc/iptables/rules.v4'
      }
    ]
  },
  {
    name: '存储 · 文件系统 · 备份',
    icon: '💾',
    desc: '数据是底线：存储规划与备份恢复是"能兜底"的能力',
    items: [
      {
        t: 'RAID 与磁盘管理', lv: '必会', must: true,
        d: [
          'RAID 0/1/5/6/10 的读写特性与故障域；重建（rebuild）期间性能骤降要提前告知业务',
          '硬 RAID 卡（缓存+BBU）vs 软 RAID（mdadm）；坏盘替换流程与热备盘',
          '分区：MBR(2T 上限) vs GPT；parted 大分区对齐',
          'SMART 巡检 <code>smartctl -a</code>，提前发现重映射扇区'
        ],
        cmd: 'lsblk\nmdadm --detail /dev/md0\nsmartctl -H /dev/sda\ncat /proc/mdstat'
      },
      {
        t: 'LVM 在线扩容', lv: '必会', must: true,
        d: [
          'PV → VG → LV 三层模型，扩容四步：加盘/扩分区 → pvcreate → vgextend → lvextend + resize2fs/xfs_growfs',
          '快照（snapshot）用于备份窗口，注意快照空间耗尽会导致失效',
          'xfs 只能扩不能缩，ext4 可 resize2fs 缩容（必须先 umount）',
          '在线扩容不影响业务，但要留有 PE 余量并演练过'
        ],
        cmd: 'pvcreate /dev/sdb\nvgextend vg_data /dev/sdb\nlvextend -l +100%FREE /dev/vg_data/lv_app\nxfs_growfs /data\n# ext4: resize2fs /dev/vg_data/lv_app'
      },
      {
        t: 'NFS / 共享存储', lv: '必会',
        d: [
          'exports 配置、权限（rw/sync/no_root_squash）、客户端挂载参数（hard/intr、nfsvers）',
          'NFS 卡死会拖垮应用，务必用 hard + 合理 timeo，或改本地盘 + 同步',
          '分布式存储认知：Ceph（RBD/CephFS/对象）、MinIO（S3 兼容）、GlusterFS',
          '云上 NAS/OSS 与自建共享存储的选型维度：性能、容量、成本、协议兼容'
        ],
        cmd: 'showmount -e nfs-server\nmount -t nfs -o vers=4.1 nfs:/data /mnt\nsystemctl status nfs-server'
      },
      {
        t: '备份策略与 3-2-1 原则', lv: '必会', must: true,
        d: [
          '3 份副本、2 种介质、1 份异地；RPO（能丢多少）与 RTO（多久恢复）决定方案',
          '全量 + 增量 + 差异的组合；备份窗口与业务高峰错开',
          '备份必须"可恢复"：定期做恢复演练并记录耗时，否则等于没有备份',
          '勒索病毒防护：备份介质离线/只读、备份账号与生产账号隔离'
        ]
      },
      {
        t: '常用备份工具', lv: '必会',
        d: [
          '文件级：tar（打包+压缩）、rsync（增量）、borg/restic（去重加密）',
          '系统级：dd 镜像（慢，慎用）、virt-backup；VMware 快照不等于备份',
          '数据库：mysqldump 逻辑备份（小库）、XtraBackup 物理热备（大库）、binlog 增量',
          '云上：快照策略 + 跨区域复制 + 对象存储版本控制'
        ],
        cmd: 'tar -zcvf /backup/etc-$(date +%F).tar.gz /etc\nrsync -avz --delete /data/ /backup/data/\nmysqldump --single-transaction --routines --triggers db > db.sql'
      }
    ]
  },
  {
    name: '数据库 MySQL',
    icon: '🗄️',
    desc: '实施交付几乎必然碰库：装、调、备、主从、排慢查询',
    items: [
      {
        t: '安装与初始化', lv: '必会', must: true,
        d: [
          '二进制包安装（生产推荐）vs yum/apt；初始化 <code>mysqld --initialize</code> 生成临时密码',
          'my.cnf 关键路径：datadir、socket、log-error、pid-file；字符集 utf8mb4 + collation',
          '目录规划：数据盘独立、binlog 独立盘、日志与数据分离',
          '安全初始化：删匿名用户、禁 root 远程、按业务建最小权限账号'
        ],
        cmd: 'mysqld --initialize --user=mysql --datadir=/data/mysql\nmysqld_safe --defaults-file=/etc/my.cnf &\nmysql_secure_installation'
      },
      {
        t: '存储引擎与索引', lv: '必会', must: true,
        d: [
          'InnoDB vs MyISAM：事务、行锁、MVCC、崩溃恢复；现在默认且只用 InnoDB',
          'B+ 树索引、聚簇索引与回表、联合索引最左前缀、覆盖索引',
          '执行计划 EXPLAIN：type（ALL/index/range/ref/eq_ref/const）、key、rows、Extra（Using filesort/temporary）',
          '索引失效场景：函数/隐式转换/前导模糊 LIKE \'%x\'/OR 条件不均衡'
        ],
        cmd: 'EXPLAIN SELECT * FROM orders WHERE user_id=1 AND status=2;\nSHOW INDEX FROM orders;\nSHOW TABLE STATUS LIKE \'orders\';'
      },
      {
        t: '事务、锁与隔离级别', lv: '必会', must: true,
        d: [
          'ACID、四种隔离级别与脏读/不可重复读/幻读的对应关系，RR 下间隙锁解决幻读',
          '行锁/表锁/意向锁、MDL 元数据锁（DDL 被长事务阻塞的经典事故）',
          '死锁：<code>SHOW ENGINE INNODB STATUS</code> 看 LATEST DETECTED DEADLOCK，按固定顺序加锁规避',
          '长事务的危害：undo 膨胀、purge 延迟、锁等待；查 information_schema.innodb_trx'
        ],
        cmd: 'SHOW ENGINE INNODB STATUS\\G\nSELECT * FROM information_schema.innodb_trx\\G\nSHOW PROCESSLIST;\nSHOW VARIABLES LIKE \'transaction_isolation\';'
      },
      {
        t: '主从复制与高可用', lv: '必会', must: true,
        d: [
          '复制三线程（dump/binlog dump、IO、SQL）+ relay log；异步/半同步/组复制',
          'GTID 复制、binlog_format=ROW、server_id 唯一；主从延迟 Seconds_Behind_Master 判读',
          '延迟原因：大事务、从库单线程回放（并行复制）、从库压力大；读写分离要防"读旧数据"',
          '高可用方案：MHA / Orchestrator / MGR / 云 RDS 主备；切换后的 VIP 与中间件刷新'
        ],
        cmd: 'SHOW MASTER STATUS;\nSHOW REPLICA STATUS\\G\nCHANGE REPLICATION SOURCE TO SOURCE_HOST=\'10.0.0.2\', SOURCE_AUTO_POSITION=1;\nSTART REPLICA;'
      },
      {
        t: '备份恢复与故障恢复', lv: '必会', must: true,
        d: [
          'XtraBackup 全备 + 增量 + binlog 做 PITR（恢复到任意时间点）的完整流程',
          '误删表/误 UPDATE 的应急：先停业务写、锁表、从 binlog 反解',
          '恢复演练脚本化：定期在预发环境恢复并校验行数与校验和',
          '备份文件加密与异地存放；备份任务失败告警必须到位'
        ],
        cmd: 'xtrabackup --backup --target-dir=/backup/full --user=root\nxtrabackup --prepare --target-dir=/backup/full\nmysqlbinlog --start-datetime="2024-01-01 10:00:00" mysql-bin.000123 | mysql -uroot -p'
      },
      {
        t: '性能优化与慢查询', lv: '必会', must: true,
        d: [
          '开 slow_query_log + long_query_time，用 pt-query-digest 做 TOP SQL 归因',
          '优化顺序：SQL 与索引 → 表结构 → 参数 → 硬件；不要一上来就调参数',
          '关键参数：innodb_buffer_pool_size（物理内存 50%~70%）、innodb_flush_log_at_trx_commit、sync_binlog',
          '连接数与线程：max_connections、wait_timeout，连接池与数据库连接数要匹配'
        ],
        cmd: 'SHOW VARIABLES LIKE \'slow_query%\'; \nSHOW GLOBAL STATUS LIKE \'Threads_connected\';\npt-query-digest slow.log | head -50'
      },
      {
        t: 'MySQL 常见故障', lv: '进阶', must: true,
        d: [
          '磁盘满 → 无法写入、主从断裂；先清 binlog（PURGE BINARY LOGS）再恢复复制',
          'Too many connections：连接泄漏或慢 SQL 堆积，先临时调大再治本',
          '表空间损坏/无法启动：innodb_force_recovery 分级尝试，先备份数据文件',
          '主键自增耗尽（int 溢出）、字符集不一致导致索引失效、时区不一致导致数据偏差'
        ]
      },
      {
        t: '其他数据库认知', lv: '加分',
        d: [
          'PostgreSQL：更丰富的类型与扩展、MVCC 实现不同、逻辑复制；信创项目常见',
          'Oracle：表空间、RMAN 备份、AWR 报告、监听器 lsnrctl；政企存量系统仍大量存在',
          '国产库：达梦 DM、人大金仓 Kingbase、OceanBase、TiDB（分布式 HTAP）迁移适配要点',
          'NoSQL 选型：Redis（缓存）、MongoDB（文档）、ES（检索）、ClickHouse（分析）'
        ]
      }
    ]
  },
  {
    name: '缓存 · 消息队列 · 中间件',
    icon: '⚡',
    desc: '缓存与 MQ 是"系统扛得住"的关键，也是面试重灾区',
    items: [
      {
        t: 'Redis 基础与运维', lv: '必会', must: true,
        d: [
          '五大数据类型 + bitmap/hyperloglog/geo/stream；单线程模型与 IO 多路复用',
          '持久化：RDB（快照，恢复快）与 AOF（appendfsync always/everysec/no）的取舍与混合持久化',
          '部署：主从 + Sentinel（哨兵）或 Cluster（16384 槽、需 6 节点起）',
          '内存策略 maxmemory-policy（LRU/LFU/random/volatile-*）、bigkey/hotkey 治理'
        ],
        cmd: 'redis-cli -h 10.0.0.3 -p 6379 info memory\nredis-cli --bigkeys\nredis-cli -c -p 7000 cluster nodes\nredis-cli monitor'
      },
      {
        t: '缓存三大问题', lv: '必会', must: true,
        d: [
          '穿透：查不存在的数据打到 DB → 布隆过滤器 / 空值缓存 + 短过期',
          '击穿：热点 key 过期瞬间大量并发 → 互斥锁重建 / 逻辑过期 / 热点永不过期 + 后台刷新',
          '雪崩：大批 key 同时失效或 Redis 宕机 → 过期时间加随机、多级缓存、限流降级、集群高可用',
          '一致性：先更新 DB 再删缓存（Cache Aside）+ 延迟双删；强一致场景用 binlog 订阅（Canal）'
        ]
      },
      {
        t: '消息队列（Kafka / RabbitMQ / RocketMQ）', lv: '必会', must: true,
        d: [
          'Kafka：分区/副本/ISR、生产者 acks、消费者组与 offset、幂等与事务',
          'RabbitMQ：exchange 类型（direct/topic/fanout/headers）、队列、ack 与死信队列',
          '选型维度：吞吐（Kafka 极高）、延迟、有序性、事务消息、运维复杂度',
          '运维要点：消息堆积监控、磁盘水位、分区扩容、消费者 lag 告警、重试与幂等设计'
        ],
        cmd: 'kafka-topics.sh --bootstrap-server kafka:9092 --describe --topic order\nkafka-consumer-groups.sh --bootstrap-server kafka:9092 --describe --group g1\nrabbitmqctl list_queues name messages consumers'
      },
      {
        t: 'Nginx 部署与配置', lv: '必会', must: true,
        d: [
          '主配置结构：全局/events/http/server/location；<code>nginx -t</code> 校验、<code>-s reload</code> 热加载',
          '反向代理 proxy_pass、upstream 负载均衡、proxy_set_header（X-Real-IP / X-Forwarded-For）',
          '静态资源：root vs alias、gzip/brotli、expires 缓存、防盗链',
          'HTTPS 配置、HTTP/2、限流限速（limit_req / limit_conn）、IP 黑白名单'
        ],
        cmd: 'nginx -t\nnginx -s reload\nnginx -T > /tmp/nginx-full.conf\ncurl -I -H "Host: api.test" http://127.0.0.1/health'
      },
      {
        t: 'Tomcat / Java 应用部署', lv: '必会', must: true,
        d: [
          'JDK 安装与环境变量、Tomcat 目录结构（conf/webapps/logs/temp）、server.xml 端口与 Connector 调优',
          'JVM 参数：-Xms/-Xmx、-XX:MetaspaceSize、GC 选择（G1/ZGC）、堆外内存',
          '部署方式：war 包热部署 vs 重启；类加载冲突、jar 包版本冲突排查',
          '日志与线程：catalina.out 切割、线程池 maxThreads、连接器超时'
        ],
        cmd: 'java -version\njps -l\njstat -gcutil <pid> 1000\njstack <pid> > /tmp/stack.txt\njmap -heap <pid>'
      },
      {
        t: 'Java 应用排障（OOM / CPU 飙高）', lv: '进阶', must: true,
        d: [
          'CPU 高：top -Hp 找线程 → printf %x 转十六进制 → jstack 中定位代码行',
          '内存溢出：<code>-XX:+HeapDumpOnOutOfMemoryError</code> 生成 dump，用 MAT 分析支配树',
          '频繁 Full GC：jstat 观察 FGC 次数与耗时，先定位大对象/缓存滥用，再考虑扩堆',
          '线程死锁：jstack 搜 "Found one Java-level deadlock"，或 jcmd Thread.print'
        ],
        cmd: 'top -Hp $PID\ntop -Hp $PID | head -20 | awk \'{printf "%x\\n", $1}\'\njstack $PID | grep -A 30 "nid=0x1a2b"\njcmd $PID GC.heap_info'
      }
    ]
  },
  {
    name: '容器与云原生',
    icon: '📦',
    desc: '现代交付的标准形态，实施岗已把 Docker/K8s 写进 JD',
    items: [
      {
        t: 'Docker 核心概念', lv: '必会', must: true,
        d: [
          '镜像分层与联合文件系统（overlay2）、容器与虚拟机隔离级别差异（namespace + cgroup）',
          'Dockerfile 最佳实践：多阶段构建、减少层数、非 root 用户、固定基础镜像 tag',
          '数据持久化：volume vs bind mount；网络模式 bridge/host/none/container',
          '私有仓库 Harbor：项目/镜像/标签规范、垃圾回收、漏洞扫描'
        ],
        cmd: 'docker ps -a\ndocker images\ndocker logs -f --tail 200 app\ndocker stats\ndocker inspect app | head -40\ndocker system df'
      },
      {
        t: 'docker-compose 单机编排', lv: '必会', must: true,
        d: [
          'compose 文件结构：services/networks/volumes、depends_on、healthcheck、环境变量 .env',
          '常见场景：一套中间件（MySQL+Redis+Nginx+应用）一键起停，适合测试与小型交付',
          '数据卷命名与备份、端口冲突、容器时区与字符集设置',
          '与 systemd 结合做开机自启，或迁移到 K8s'
        ],
        cmd: 'docker compose up -d\ndocker compose ps\ndocker compose logs -f --tail=100\ndocker compose down -v'
      },
      {
        t: 'Kubernetes 核心对象', lv: '必会', must: true,
        d: [
          'Pod / Deployment / StatefulSet / DaemonSet / Job、Service（ClusterIP/NodePort/LoadBalancer）、Ingress',
          'ConfigMap / Secret、PV/PVC/StorageClass、Namespace 与资源配额 ResourceQuota',
          '探针：liveness / readiness / startup 的区别与配置错误导致的反复重启',
          '调度：requests/limits、nodeSelector、亲和性与污点容忍'
        ],
        cmd: 'kubectl get pods -A -o wide\nkubectl describe pod <pod>\nkubectl logs -f <pod> -c <container>\nkubectl exec -it <pod> -- sh\nkubectl top pod'
      },
      {
        t: 'K8s 排障与运维', lv: '进阶', must: true,
        d: [
          'Pod 异常状态：Pending（调度/资源）、ImagePullBackOff、CrashLoopBackOff、Evicted（节点压力）',
          '事件是第一现场：<code>kubectl describe</code> / <code>kubectl get events --sort-by=.lastTimestamp</code>',
          '网络：Service 不通查 Endpoints、CNI（Calico/Flannel）、NetworkPolicy；DNS 查 CoreDNS',
          '节点维护：cordon/drain/uncordon、etcd 备份、证书过期（kubeadm certs check-expiration）'
        ],
        cmd: 'kubectl get events -A --sort-by=.lastTimestamp | tail -20\nkubectl get endpoints <svc>\nkubectl drain node1 --ignore-daemonsets --delete-emptydir-data\nkubeadm certs check-expiration'
      },
      {
        t: '集群安装与交付', lv: '进阶',
        d: [
          'kubeadm 安装流程：系统初始化（swap、内核模块、sysctl）→ 容器运行时 → init/join → CNI → 存储类',
          '二进制/k3s/RKE2/云托管 K8s 的选型：离线环境优先考虑 k3s 或离线镜像包',
          '离线交付：镜像导入导出、私有仓库同步、Helm chart 本地化',
          '高可用：多 master + etcd 集群（奇数节点）、VIP + keepalived、负载均衡 apiserver'
        ],
        cmd: 'kubeadm init --pod-network-cidr=10.244.0.0/16\nkubeadm token create --print-join-command\nctr -n k8s.io images import app.tar\nhelm install app ./chart -f values-prod.yaml'
      }
    ]
  },
  {
    name: '自动化运维与 CI/CD',
    icon: '🤖',
    desc: '从"人肉运维"到"平台化"，决定你的薪资上限',
    items: [
      {
        t: 'Ansible 批量管理', lv: '必会', must: true,
        d: [
          '无 agent（SSH）架构、inventory 分组、ad-hoc 与 playbook、roles 目录规范',
          '常用模块：copy/template/file/yum/service/user/command/shell/lineinfile',
          '幂等性、handlers 触发重启、变量与 facts、vault 加密敏感信息',
          '大规模执行：forks 并发、serial 灰度、delegate_to、失败重试'
        ],
        cmd: 'ansible all -m ping\nansible-playbook -i hosts site.yml --check --diff\nansible-playbook -i hosts deploy.yml -l web --tags config'
      },
      {
        t: 'Python 运维脚本', lv: '必会', must: true,
        d: [
          '标准库：os/sys/subprocess/shutil/pathlib/argparse/logging/json/re',
          'requests 调 API、paramiko 远程执行、psutil 采指标、openpyxl 出报表',
          '运维界面化：Flask/FastAPI 做内部小工具（巡检、发布、审批）',
          '代码规范与可维护：日志、异常处理、配置外置、命令行参数、单元测试'
        ],
        cmd: 'python3 -m venv /opt/venv && source /opt/venv/bin/activate\npip install requests psutil\npython3 -c "import psutil;print(psutil.cpu_percent(interval=1))"'
      },
      {
        t: 'Git 与版本管理', lv: '必会', must: true,
        d: [
          '分支模型（GitFlow / trunk-based）、tag 与 release、code review',
          '常用操作：rebase、cherry-pick、stash、reset 三模式、reflog 救回误删',
          '冲突解决流程、.gitignore、大文件 LFS、子模块',
          '生产变更必须走 MR + 双人评审 + 可回滚版本号'
        ],
        cmd: 'git status\ngit log --oneline --graph -20\ngit reset --hard HEAD~1\ngit reflog\ngit diff --stat origin/main'
      },
      {
        t: 'Jenkins / GitLab CI 流水线', lv: '必会', must: true,
        d: [
          'Jenkins：master/agent、凭据管理、Pipeline（Jenkinsfile）声明式语法、共享库',
          'GitLab CI：.gitlab-ci.yml、stage/job/runner、缓存与制品、环境与手动审批',
          '流水线阶段：拉代码 → 编译构建 → 单测 → 镜像构建 → 推送仓库 → 部署 → 冒烟验证',
          '质量门禁：SonarQube 扫描、镜像漏洞扫描、变更审批'
        ],
        cmd: 'pipeline { agent any; stages { stage(\'build\') { steps { sh \'mvn -B clean package\' } } } }'
      },
      {
        t: '发布策略与变更管理', lv: '必会', must: true,
        d: [
          '蓝绿、灰度/金丝雀、滚动发布、A/B 测试的适用场景与回滚速度',
          '发布前检查单：备份、回滚包、变更窗口、通知、监控看板、值班人',
          '回滚要"一键"：旧版本镜像/包常驻、数据库变更需向后兼容（先加字段后写代码）',
          '变更失败率、MTTR、发布频率、交付周期（DORA 四指标）是运维价值的量化口径'
        ]
      },
      {
        t: '基础设施即代码（IaC）', lv: '加分',
        d: [
          'Terraform 管理云资源、state 与锁、模块化；Ansible 管配置，二者边界清晰',
          'Helm/Kustomize 管理 K8s 应用；ArgoCD 做 GitOps 持续同步',
          '配置中心：Apollo/Nacos/Consul，灰度配置与回滚',
          '理念：环境可重建、变更可追溯、配置有版本'
        ]
      }
    ]
  },
  {
    name: '监控告警与可观测性',
    icon: '📊',
    desc: '"没有监控的运维等于裸奔"，面试必问监控体系设计',
    items: [
      {
        t: '监控体系分层', lv: '必会', must: true,
        d: [
          '四层：基础设施（CPU/内存/磁盘/网络）→ 中间件（JVM/MySQL/Redis）→ 应用（QPS/RT/错误率）→ 业务（订单/支付成功率）',
          '指标（Metrics）、日志（Logs）、链路（Traces）三支柱；SLI/SLO/错误预算',
          '告警分级（P0-P3）与响应时效，告警风暴治理（分组、抑制、静默）',
          '黄金指标：延迟、流量、错误、饱和度（Google SRE 四信号）'
        ]
      },
      {
        t: 'Prometheus + Grafana', lv: '必会', must: true,
        d: [
          '拉取模型（scrape）、exporter（node_exporter/mysqld_exporter）、Pushgateway 的适用场景',
          'PromQL：rate/irate、sum by、histogram_quantile 算 P99、absent 检测缺失',
          '告警规则 Alertmanager：分组、抑制、静默、路由到钉钉/企微/电话',
          '存储与高可用：本地 TSDB 保留期、远程写入 VictoriaMetrics/Thanos'
        ],
        cmd: 'promtool check rules rules.yml\n# 示例：up{job="node"} == 0\nhistogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))'
      },
      {
        t: 'Zabbix 与传统监控', lv: '必会',
        d: [
          'Server/Agent/Proxy 架构、主机与模板、自动发现与自动注册',
          '触发器表达式、依赖关系、维护窗口；图形与聚合图形',
          'SNMP 采集网络设备与硬件（iDRAC）；LLD 自动发现磁盘/网卡',
          '政企存量环境 Zabbix 仍占主流，迁移到 Prometheus 的过渡策略要能讲清'
        ],
        cmd: 'zabbix_get -s 10.0.0.5 -k system.cpu.util\nzabbix_server -R config_cache_reload'
      },
      {
        t: '日志平台 ELK / EFK', lv: '必会', must: true,
        d: [
          'Filebeat/Logstash 采集 → Elasticsearch 存储索引 → Kibana 检索可视化',
          '索引生命周期 ILM（热温冷）、分片与副本规划、磁盘水位与只读索引',
          'Kibana 查询语法、字段映射（mapping）冲突导致写入失败',
          '替代方案：Loki（轻量）、ClickHouse（海量日志）、云日志服务'
        ],
        cmd: 'curl -XGET "localhost:9200/_cat/indices?v"\ncurl -XGET "localhost:9200/_cluster/health?pretty"\nfilebeat test config -c filebeat.yml'
      },
      {
        t: '链路追踪与 APM', lv: '进阶',
        d: [
          'TraceID/SpanID 透传（HTTP Header、MQ、RPC），Jaeger/SkyWalking/Zipkin',
          'APM 价值：定位慢调用、依赖拓扑、错误聚合；与日志通过 traceId 关联',
          '采样策略：头部采样/尾部采样，控制开销',
          '云厂商 ARMS/APM 与开源自建的取舍'
        ]
      },
      {
        t: '告警治理与值班', lv: '必会', must: true,
        d: [
          '告警要"可行动"：每条告警都有明确处置手册（Runbook），否则就是噪声',
          '降噪三板斧：阈值合理化（用历史分位数）、同源合并、依赖抑制',
          '值班机制：On-call 轮值、升级路径、故障等级与通报模板',
          '复盘（Postmortem）：时间线、根因、改进项与责任人，非追责文化'
        ]
      }
    ]
  },
  {
    name: '安全合规与主机加固',
    icon: '🛡️',
    desc: '政企/金融项目实施绕不开等保，安全是交付验收的硬指标',
    items: [
      {
        t: '等保 2.0 基础', lv: '必会', must: true,
        d: [
          '五个等级、定级备案流程、测评周期（三级每年测评）',
          '技术要求十类：物理/网络/主机/应用/数据安全 + 安全管理中心；管理要求五类',
          '三级常见硬指标：双因素认证、日志留存 6 个月、审计、入侵防范、数据备份与恢复',
          '实施侧落地：堡垒机、日志审计、数据库审计、漏洞扫描、防病毒、态势感知'
        ]
      },
      {
        t: '主机安全加固基线', lv: '必会', must: true,
        d: [
          '账号：禁用无用账号、改默认端口、密码复杂度与有效期、登录失败锁定',
          '服务最小化：关闭不必要的服务与端口、卸载无关组件',
          '文件权限：/etc/passwd、/etc/shadow、sshd_config、crontab 权限收紧',
          '审计：auditd 规则、syslog 外送、bash 命令历史留存'
        ],
        cmd: 'chage -l root\nawk -F: \'($3==0){print $1}\' /etc/passwd\nauditctl -w /etc/passwd -p wa -k passwd_change\nsystemctl list-unit-files --state=enabled'
      },
      {
        t: '漏洞与补丁管理', lv: '必会', must: true,
        d: [
          '漏洞扫描（Nessus/OpenVAS/绿盟/云镜）、CVE 与 CVSS 评分、修复优先级',
          '补丁流程：测试环境验证 → 灰度 → 全量；内核升级要评估重启窗口',
          '高危端口暴露治理（6379/9200/3306 公网暴露是重灾区）',
          '供应链安全：镜像基础层漏洞、依赖组件（Log4j 类事件）应急响应'
        ]
      },
      {
        t: 'Web 与中间件安全', lv: '进阶', must: true,
        d: [
          'OWASP Top10 认知：注入、XSS、越权、反序列化、SSRF',
          'WAF 部署与规则、CC 攻击防护、防重放',
          'TLS 加固：禁用 TLS1.0/1.1、弱加密套件、HSTS',
          '密钥与凭据管理：禁止硬编码、配置加密、定期轮换'
        ],
        cmd: 'nmap -sV -p- 10.0.0.5\nopenssl s_client -connect x:443 -tls1_1\nss -lntp | grep -E ":(6379|9200|3306)"'
      },
      {
        t: '数据安全与合规', lv: '进阶',
        d: [
          '数据分类分级、脱敏（静态/动态）、加密存储与传输',
          '个人信息保护法/数据安全法对运维的要求：最小必要、访问留痕、跨境限制',
          '日志与审计数据的保存期限与不可篡改（WORM 存储）',
          '权限治理：最小权限、定期权限复核、离职即时回收'
        ]
      }
    ]
  },
  {
    name: '云平台与虚拟化',
    icon: '☁️',
    desc: '交付对象越来越"云化"，云上运维与传统运维的差异点',
    items: [
      {
        t: '虚拟化基础（VMware / KVM）', lv: '必会', must: true,
        d: [
          'Hypervisor 类型（裸金属 ESXi / 宿主型 KVM）、vCPU 超分、内存气球、资源池与 DRX 集群',
          'vSphere 关键操作：模板与克隆、快照、vMotion、HA/DRS、存储（iSCSI/NFS/vSAN）',
          'KVM：qemu-img、virsh、桥接网卡、virtio 驱动性能',
          '虚拟化性能问题：CPU 就绪时间、存储延迟、超分过度'
        ],
        cmd: 'virsh list --all\nvirsh console vm1\nqemu-img info disk.qcow2\nesxcli vm process list'
      },
      {
        t: '公有云核心产品', lv: '必会', must: true,
        d: [
          '计算（ECS/EC2）、存储（块/对象/文件）、网络（VPC/子网/安全组/NAT/ELB）、数据库 RDS',
          '云上高可用：多可用区部署、SLB 健康检查、弹性伸缩、跨地域容灾',
          '成本优化：包年包月 vs 按量、预留实例、闲置资源回收、存储分层',
          '云上运维差异：无硬件、靠 API/控制台、IAM 权限、日志与监控托管服务'
        ],
        cmd: 'aliyun ecs DescribeInstances --RegionId cn-hangzhou\naws ec2 describe-instances --region ap-east-1'
      },
      {
        t: '网络与混合云连通', lv: '进阶', must: true,
        d: [
          'VPC 规划（网段不冲突）、子网划分、路由表、对等连接/云企业网',
          '专线/VPN 打通 IDC 与云，BGP 与静态路由选择',
          '混合云部署形态：数据库在 IDC、应用在云；跨云容灾',
          '云上 DNS 解析、内网域名、私网访问对象存储的 VPC 端点'
        ]
      },
      {
        t: 'Windows Server 与域环境', lv: '必会',
        d: [
          'AD 域、OU、组策略（GPO）、DNS 与 DHCP 集成',
          'IIS 部署、证书绑定、应用程序池回收设置',
          'Windows 事件日志、性能监视器、任务计划、远程桌面与 WinRM',
          '政企环境常见：加域失败排查（时间偏差、DNS 指向）、组策略不生效 gpupdate /force'
        ],
        cmd: 'gpupdate /force\ndcdiag\nGet-ADUser -Filter * | Measure-Object\nwinrm quickconfig'
      }
    ]
  },
  {
    name: '实施交付与项目管理',
    icon: '🚀',
    desc: '实施岗的核心差异：不是"会技术"，而是"能把系统交出去"',
    items: [
      {
        t: '项目实施全流程', lv: '必会', must: true,
        d: [
          '启动（合同/范围/干系人）→ 调研（现状、网络、服务器、账号）→ 方案设计 → 环境准备 → 部署实施 → 数据迁移 → 测试（UAT）→ 上线 → 验收 → 运维移交',
          '每个阶段的交付物：实施方案、网络拓扑图、部署清单、测试报告、上线方案、验收报告、操作手册',
          '里程碑与甘特图、风险登记册、变更单（任何超范围都要走变更）',
          '项目复盘的三个问题：延期原因、质量问题、客户满意度'
        ]
      },
      {
        t: '需求调研与现状摸排', lv: '必会', must: true,
        d: [
          '调研清单：业务量级（并发/用户数/数据量）、现有系统与版本、网络与安全策略、机房与电力、账号与权限流程',
          '一定要拿到的信息：服务器规格与操作系统版本、数据库版本与字符集、中间件版本、对外开放端口、域名与证书',
          '识别隐藏约束：等保要求、信创要求（国产 CPU/OS/DB）、内网隔离、审批周期',
          '输出《环境确认单》并让客户签字，避免后期扯皮'
        ]
      },
      {
        t: '部署方案与实施文档', lv: '必会', must: true,
        d: [
          '方案要素：架构图、部署拓扑、软硬件清单、端口矩阵、部署步骤、回滚方案、时间计划',
          '文档模板化：安装手册（可照做）、运维手册、应急预案、交接清单',
          'IP/端口/账号/证书的登记表是交付的核心资产，必须版本化',
          '写文档的标准：换一个人照着能装出来'
        ]
      },
      {
        t: '上线与割接', lv: '必会', must: true,
        d: [
          '上线窗口选择、停机公告、数据备份、割接步骤逐步验证、回滚触发条件',
          '数据迁移：全量 + 增量追平 + 校验（行数/校验和/抽样比对）+ 切换',
          'DNS 切换与 TTL 预热、灰度放量、老系统并行观察期',
          '上线后 24 小时值守与指标看板，出问题第一时间能回滚'
        ]
      },
      {
        t: '验收与移交', lv: '必会', must: true,
        d: [
          '验收依据是合同与需求确认单，逐条对照功能与非功能项（性能、安全、可用性）',
          '验收材料：测试用例执行记录、问题清单闭环、培训记录、文档签收单',
          '培训：管理员培训 + 最终用户培训，留录像与 FAQ',
          '移交运维：监控接入、告警接收人、值班表、SLA 与响应时效'
        ]
      },
      {
        t: '沟通与干系人管理', lv: '必会', must: true,
        d: [
          '对接角色：客户项目经理、业务方、甲方 IT/网络/安全、厂商支持、内部研发',
          '沟通原则：结论先行、说人话、留书面记录（邮件/纪要）、承诺要能兑现',
          '冲突处理：先解决情绪与事实，再谈方案；升级机制提前约定',
          '汇报节奏：日报/周报、风险前置暴露，坏消息越早说代价越小'
        ]
      },
      {
        t: '常见实施坑与应对', lv: '必会', must: true,
        d: [
          '环境与文档不符（版本、内核、依赖缺失）→ 提前做环境基线核查脚本',
          '客户网络策略未开通 → 提前给端口矩阵并跟踪开通进度',
          '账号权限不足/审批慢 → 提前 3 天走流程，准备临时授权方案',
          '性能不达标 → 上线前必须做压测，别把风险留到生产'
        ]
      }
    ]
  },
  {
    name: '故障排查与应急响应',
    icon: '🔍',
    desc: '面试最能拉开差距的部分：你处理过什么故障，怎么定位的',
    items: [
      {
        t: '排障方法论', lv: '必会', must: true,
        d: [
          '先止损再定位：限流/降级/回滚/切流，避免故障扩大',
          '分层假设法：从下往上（硬件→系统→网络→中间件→应用→业务）逐层排除，用数据验证假设',
          '对比法：与正常节点比对（配置、版本、内核参数、时间）',
          '时间线法：故障前有哪些变更（发布、配置、证书、扩容、DNS）——80% 故障由变更引起'
        ]
      },
      {
        t: 'CPU 飙高排查', lv: '必会', must: true,
        d: [
          '定位到进程：top → 定位到线程：top -Hp → 转十六进制 → jstack/pstack 找栈',
          '区分用户态（业务计算/死循环）与内核态（sy 高：系统调用、上下文切换）',
          '常见原因：定时任务叠加、GC 线程、正则回溯、死循环、被挖矿',
          '处置：先摘流量/限流，再分析代码或重启，最后加监控与告警'
        ],
        cmd: 'top -Hp <pid>\npidstat -u 1 5\nps -eo pid,pcpu,cmd --sort=-pcpu | head\nperf top -p <pid>'
      },
      {
        t: '内存与 OOM 排查', lv: '必会', must: true,
        d: [
          '看 available、swap 使用、进程 RSS 趋势；<code>dmesg -T | grep -i oom</code> 找被杀进程',
          'Java 堆外/元空间/线程栈、Netty 直接内存、mmap 文件缓存都可能"看不到"',
          '内存泄漏 vs 内存膨胀：前者随时间不回落，后者随流量波动',
          '处置：dump 现场（heap dump / pmap）、限流扩容、修复后回归压测'
        ],
        cmd: 'dmesg -T | grep -i "out of memory"\nps aux --sort=-rss | head\njmap -histo:live <pid> | head -20\npmap -x <pid> | tail -5'
      },
      {
        t: '磁盘与 IO 问题', lv: '必会', must: true,
        d: [
          '磁盘满：先找大文件（du -sh /* 逐层），再找已删除但被占用的文件（lsof +L1）',
          'inode 满：小文件过多，<code>df -i</code> 确认，清理缓存/日志',
          'IO 高：iostat 看 %util/await，iotop 定位进程，判断是顺序写还是随机写',
          '写满保护：数据库/日志/容器镜像目录要配独立盘与水位告警'
        ],
        cmd: 'df -h; df -i\ndu -sh /* 2>/dev/null | sort -rh | head\nlsof +L1 | head\niostat -x 1 5\niotop -oP'
      },
      {
        t: '网络类故障', lv: '必会', must: true,
        d: [
          '"能 ping 通但服务不可用"：查端口、查防火墙、查服务监听地址（127.0.0.1 vs 0.0.0.0）',
          '大量 TIME_WAIT / CLOSE_WAIT：前者调内核参数与长连接，后者是对端未关连接（应用 bug）',
          '丢包与延迟：mtr 定位路径节点、tcpdump 看重传与 RST',
          'DNS 解析异常导致间歇性失败：看 resolv.conf、ndots、本地缓存'
        ],
        cmd: 'mtr -n -r -c 20 target\nss -s\ntcpdump -i eth0 -nn host 10.0.0.5\ncurl -v --max-time 5 http://target/health'
      },
      {
        t: '数据库故障应急', lv: '进阶', must: true,
        d: [
          '连接数打满：先杀长时间空闲连接 + 临时调大，再定位泄漏源',
          '主从延迟：看 relay log 与应用线程，大事务拆批，必要时并行复制',
          '锁等待/死锁：查 innodb_trx 与 processlist，KILL 掉阻塞源（谨慎）',
          '误操作：立即锁表/停写、备份现状、binlog 反解、演练恢复'
        ],
        cmd: 'SHOW FULL PROCESSLIST;\nSELECT * FROM information_schema.innodb_trx ORDER BY trx_started LIMIT 5;\npt-kill --match-command Sleep --idle-time 600 --kill'
      },
      {
        t: '应急与事故管理', lv: '必会', must: true,
        d: [
          '事故分级与响应：谁指挥、谁定位、谁沟通、谁记录（角色分离）',
          '对外沟通模板：影响范围、当前状态、预计恢复时间、下次更新时间',
          '保留现场：日志、监控截图、dump、变更记录，避免"重启后什么都看不到"',
          '复盘输出改进项并跟踪闭环，形成知识库与预案'
        ]
      }
    ]
  },
  {
    name: 'ERP · 财务共享 · 商旅业务',
    icon: '🧾',
    desc: '面向财务/商旅类系统的实施岗：不懂业务，配置和排障都无从下手',
    items: [
      {
        t: '商旅与差旅业务全流程', lv: '必会', must: true,
        d: [
          '主线：出差申请（事前审批）→ 差旅预订（机票/酒店/火车/用车）→ 出差中变更与补录 → 差旅报销 → 审核 → 付款/记账 → 与供应商对账结算',
          '关键规则：差旅标准（职级对应的住宿/舱位上限）、超标审批、事前审批与事后报销的关联、行程单与发票的一致性',
          '常见系统能力：因公预订协议价、企业支付与个人垫付、月结账单、未出行退改签、行程自动匹配报销单',
          '典型问题：审批通过但预订失败（库存/协议价有效期）、行程与报销单日期不符、跨公司主体出差费用归属错误',
          '理解方式：把「谁申请、谁审批、谁垫钱、谁付款、记到哪个成本中心」五个问题问清楚，流程就通了'
        ]
      },
      {
        t: '费用报销与发票合规', lv: '必会', must: true,
        d: [
          '单据要件：报销单 + 发票（或财政票据/行程单）+ 审批流记录 + 附件（参会通知、清单）；缺件是退回的第一大原因',
          '发票要点：发票类型（专票/普票/电子发票）、税号与抬头、税率与税额、发票查验（全国增值税发票查验平台）、重复报销校验（发票号码+代码唯一）',
          '费用类型与会计影响：差旅费、业务招待费、办公费、会议费对应的科目与税前扣除规则不同，配置错会导致账务错',
          '合规红线：虚开、拆票、超标准报销、非本单位人员费用；实施时要做校验规则而不是靠人工卡',
          '排障思路：先看单据状态机（草稿/审批中/已通过/已付款/已记账）卡在哪一步，再看审批流与校验规则'
        ]
      },
      {
        t: '财务共享服务中心（SSC）与流程标准化', lv: '熟悉',
        d: [
          'SSC 的本质：把分散在各分子公司的核算/报销/应付作业集中到共享中心，按标准化流程批量处理',
          '核心机制：影像系统（票据扫描/OCR 识别）、工单池派单、作业标准与时效 KPI、抽检与质检、服务水平协议（SLA）',
          '系统角色：报账人 → 业务审批人 → 共享中心审核 → 出纳付款 → 总账会计；每个角色的待办与驳回原因都要能查',
          '实施关注点：组织与权限映射（多法人、多账套）、审批流可配置、批量导入与批量审核、异常单据的退回话术模板',
          '数据视角：单据量、平均处理时长、退回率、一次通过率——这些是客户最关心的运营指标'
        ]
      },
      {
        t: '业财一体化与凭证生成', lv: '必会', must: true,
        d: [
          '业财一体化 = 业务单据自动生成会计凭证，减少手工录入与对账差异；核心是「业务事件 → 会计规则 → 凭证」的映射',
          '配置三要素：会计科目映射、辅助核算（部门/项目/成本中心/供应商）、记账期间与汇率',
          '对账思路：业务金额汇总 vs 凭证金额汇总 vs 总账余额，三方对齐才叫平；差异按单据逐笔追',
          '常见故障：凭证生成失败（科目缺失/辅助核算未配置/期间已结账）、借贷不平、金额与业务单据不一致、重复生成',
          '验收标准：抽样 20 笔业务，单据金额 = 凭证金额 = 总账明细，且科目与辅助核算正确'
        ],
        cmd: '-- 业务单据与凭证对账（示意）\nSELECT b.bill_no, b.amount, v.voucher_no, v.amount AS v_amount\nFROM biz_bill b LEFT JOIN voucher v ON v.biz_id = b.id\nWHERE b.create_date >= \'2025-01-01\' AND (v.id IS NULL OR v.amount <> b.amount);'
      },
      {
        t: 'ERP 主数据与基础配置', lv: '必会', must: true,
        d: [
          '主数据：组织架构、人员与岗位、供应商/客户、会计科目表、成本中心、费用项目、币种与汇率、税率',
          '主数据错了，后面全是脏数据：上线前必须做一轮主数据清洗与冻结（尤其科目与组织）',
          '配置项：审批流（条件分支、会签、加签、委托）、单据模板与必填校验、权限角色（功能权限 + 数据权限）',
          '权限问题是最常见的"功能不好用"根因：先确认当前用户角色、数据范围（本人/本部门/全公司）',
          '变更管理：配置改动要有记录并能在测试环境复现，生产直接改配置是事故高发区'
        ]
      },
      {
        t: '财务基础概念（实施必懂）', lv: '熟悉',
        d: [
          '借贷记账：有借必有贷、借贷必相等；资产/费用增加记借方，负债/收入/权益增加记贷方',
          '期间与结账：月结后不能补录上月单据（除非反结账），跨期单据是月末最集中的问题',
          '预提与摊销、暂估、红冲（负数单据）、凭证冲销——客户会直接拿这些词问你',
          '报表三层：明细账 → 科目余额表 → 财务报表（资产负债表/利润表/现金流量表）',
          '不必会做账，但必须能听懂客户在说什么，并能判断"这是系统问题还是账务处理问题"'
        ]
      },
      {
        t: '实施方法论：调研-配置-测试-上线', lv: '必会', must: true,
        d: [
          '调研：访谈关键用户 + 收集现有单据与报表 + 梳理现状流程图（XMind/Visio），输出《需求确认单》',
          '配置：按需求清单逐项配置，边配边记录《配置清单》（谁改了什么、为什么）',
          '测试：单元（单个功能）→ 集成（跨模块）→ UAT（真实用户用真实数据跑一遍），缺陷按 P0/P1/P2 分级并跟踪闭环',
          '上线：数据迁移 + 期初余额导入 + 权限核对 + 培训 + 切换窗口 + 回滚预案，缺一不可',
          '交付物：实施方案、配置清单、测试报告、操作手册、培训记录、验收单；这些东西决定项目能不能顺利结项'
        ]
      }
    ]
  },
  {
    name: 'Excel · SQL · 数据核对',
    icon: '📊',
    desc: '实施岗的日常武器：取数、对账、出报表、找差异',
    items: [
      {
        t: 'Excel 高频函数（够用即止）', lv: '必会', must: true,
        d: [
          '查找匹配：VLOOKUP（第四参数 0 精确匹配）、XLOOKUP（更稳，支持反向查找与找不到时的默认值）、INDEX+MATCH',
          '条件汇总：SUMIFS / COUNTIFS / AVERAGEIFS，多条件时把条件区域与条件成对写',
          '逻辑与文本：IF / IFS / AND / OR、TEXT（日期格式）、TRIM 与 CLEAN（清理导入脏数据）、LEFT/MID/FIND',
          '去重与判断：COUNTIF 判重（大于 1 即重复）、UNIQUE（新版）、EXACT 区分大小写比较',
          '避坑：VLOOKUP 匹配失败常见原因是文本型数字与数值型不一致（用 TRIM 或分列统一）、有隐藏空格、区域未绝对引用'
        ],
        cmd: '=XLOOKUP(A2, 明细!B:B, 明细!E:E, "未找到")\n=SUMIFS(明细!F:F, 明细!C:C, "差旅费", 明细!D:D, ">=2025-01-01")\n=COUNTIF($B$2:$B$9999, B2)>1'
      },
      {
        t: '数据透视表与 Power Query', lv: '熟悉',
        d: [
          '透视表：行/列/值/筛选四区，值字段可切换求和/计数/去重计数；配合切片器做交互',
          '常见需求：按月按部门汇总金额、按费用类型排名、计算人均与同比',
          'Power Query：多表合并（追加/合并查询）、清洗步骤可复用，适合每月重复的对账工作',
          '习惯：原始数据单独一个 sheet 且不做任何手工修改，分析在另一个 sheet 做，避免"数据源被污染"'
        ]
      },
      {
        t: '数据核对方法论（实施核心技能）', lv: '必会', must: true,
        d: [
          '四步法：① 定口径（统计范围、时间区间、含税/不含税、是否含作废）② 比条数 ③ 比金额 ④ 逐笔找差异',
          '差异定位：用主键（单据号/发票号/工号）做全连接比对，左右缺失各代表一类问题（漏同步 / 多生成）',
          '双跑对比：新旧系统同期数据并行导出对比，是迁移验收的必备动作',
          '留痕：每次核对输出《核对报告》——口径、数据源、条数、金额、差异清单、结论，客户签字确认',
          '经验：90% 的"数据不对"是口径不同而不是系统 BUG，先把口径写下来再查'
        ]
      },
      {
        t: 'SQL 基础：增删改查', lv: '必会', must: true,
        d: [
          '查询：SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT',
          '聚合：COUNT/SUM/AVG/MAX/MIN，配合 GROUP BY；HAVING 过滤聚合结果（WHERE 不能）',
          '多表：INNER JOIN（都有才留）、LEFT JOIN（左表全留，右表空则 NULL）、UNION ALL（上下拼接）',
          '改数据前必须：先用同样的 WHERE 跑一次 SELECT 确认影响行数，事务里操作，必要时先备份表',
          '生产环境原则：只读优先、加 LIMIT、避免全表更新、改数据走工单'
        ],
        cmd: "-- 按费用类型统计本月报销金额\nSELECT expense_type, COUNT(*) AS cnt, SUM(amount) AS total\nFROM expense_bill\nWHERE bill_date >= '2025-06-01' AND bill_date < '2025-07-01'\n  AND status <> 'CANCELLED'\nGROUP BY expense_type\nORDER BY total DESC;\n\n-- 找有单据但没生成凭证的\nSELECT b.bill_no FROM biz_bill b\nLEFT JOIN voucher v ON v.biz_id = b.id\nWHERE v.id IS NULL;"
      },
      {
        t: '取数与排查的实战套路', lv: '熟悉', must: true,
        d: [
          '线上取数别拖垮库：加时间范围与 LIMIT、走从库、避开业务高峰、大结果集导出用工具而不是 SELECT 全表',
          '乱码/截断：确认字符集（utf8mb4）、字段长度、导出编码；Excel 打开 CSV 乱码先用记事本另存为 UTF-8 带 BOM',
          '数字变成科学计数法或前导零丢失：导出时用文本格式或加等号引号处理，工号/发票号尤其注意',
          '定位"某条数据不对"：拿到业务单号 → 查单据主表 → 查明细表 → 查审批流日志 → 查凭证 → 查是否有后台任务未执行',
          '把常用查询存成 .sql 片段库，下次同类问题直接改条件，效率翻倍'
        ]
      }
    ]
  },
  {
    name: 'Windows Server 与企业内网',
    icon: '🪟',
    desc: '政企/制造业项目实施绕不开：域控、DNS、IIS、文件共享',
    items: [
      {
        t: 'Active Directory 域服务', lv: '必会', must: true,
        d: [
          '域控（DC）提供统一身份认证，客户端加入域后账号集中管理；一个域内建议至少两台 DC 互备',
          'OU 是组织单位，用于分层管理对象；组策略（GPO）挂在站点/域/OU 上，按 LSDOU 顺序生效、后覆盖先',
          '域内关键角色：DNS（AD 强依赖）、时间同步（偏差超 5 分钟会导致认证失败）、FSMO 五种操作主机角色',
          '加入域排错顺序：DNS 能否解析域名 SRV 记录 → 网络与端口（53/88/389/445）→ 时间同步 → 计算机账号'
        ],
        cmd: 'nltest /dsgetdc:corp.local\nnslookup -type=SRV _ldap._tcp.dc._msdcs.corp.local\ngpresult /r /scope:computer'
      },
      {
        t: 'DNS 服务配置与排错', lv: '必会', must: true,
        d: [
          '正向区域（域名→IP）、反向区域（IP→域名）、转发器（上游解析）、条件转发（按域分流）',
          '记录类型：A、AAAA、CNAME、MX、TXT、SRV、PTR；AD 集成区域支持安全动态更新',
          '客户端排查：ipconfig /all 看实际 DNS 服务器 → nslookup 指定服务器测试 → 清缓存 ipconfig /flushdns',
          '常见故障：DNS 指向了外网服务器导致内网域名解析失败、转发器不通导致外网慢、记录残留导致切机不生效'
        ],
        cmd: 'ipconfig /all\nipconfig /flushdns\nnslookup app.corp.local 10.0.0.10\ndnscmd /zoneexport corp.local corp.local.txt'
      },
      {
        t: 'IIS 站点部署与 HTTPS', lv: '必会', must: true,
        d: [
          '站点 = 绑定（IP:端口:主机名）+ 物理路径 + 应用池；应用程序池隔离不同应用的运行时与身份',
          '应用池标识（ApplicationPoolIdentity）决定文件与数据库访问权限，权限不足常表现为 500.19/500.21',
          'HTTPS 绑定需导入 PFX 证书；证书续期后要重新绑定并在所有节点同步',
          '日志默认在 C:\\inetpub\\logs\\LogFiles，可用 Log Parser / 日志分析工具统计 5xx'
        ],
        cmd: 'iisreset /noforce\n%windir%\\system32\\inetsrv\\appcmd list site\nnetstat -ano | findstr :443'
      },
      {
        t: '文件共享与 NTFS 权限', lv: '熟悉',
        d: [
          '共享权限与 NTFS 权限取交集，实际有效权限是两者中更严格的那个',
          '最小权限原则：共享给「Everyone 完全控制」+ NTFS 精确控制是常见但危险的做法，应共享层也收敛',
          '访问排查：有效权限查看（安全→高级→有效访问）、SMB 端口 445、SMB 版本兼容（老设备可能只支持 SMBv1）',
          '容量与配额：文件服务器资源管理器（FSRM）做目录配额与文件屏蔽'
        ],
        cmd: 'net share\nnet use \\\\fileserver\\share /user:corp\\zhangsan\nGet-SmbSession | Select ClientComputerName,Dialect'
      },
      {
        t: 'Windows 备份与灾难恢复', lv: '熟悉',
        d: [
          'Windows Server Backup 做系统状态与整机备份；域控需额外做系统状态备份以支持权威/非权威恢复',
          '虚拟机环境优先用平台级快照 + 定期完整备份，快照不能替代备份',
          '恢复演练：每年至少验证一次域控恢复、文件恢复、数据库恢复',
          '备份三问：能不能恢复、多久能恢复（RTO）、会丢多少数据（RPO）'
        ]
      },
      {
        t: '远程管理与安全基线', lv: '熟悉',
        d: [
          '远程方式：RDP（3389）、WinRM/PowerShell Remoting（5985/5986）、第三方堡垒机',
          '基线要点：禁用 Administrator 远程登录名或改名、强密码策略、关闭 SMBv1、开启审核策略、补丁管理（WSUS）',
          'RDP 暴露公网是勒索病毒主要入口，必须经堡垒机/VPN',
          '日志集中：把安全日志转发到 SIEM 或日志服务器，本地日志易被清除'
        ],
        cmd: 'Get-WinEvent -LogName Security -MaxEvents 20\nwinrm quickconfig\nGet-SmbServerConfiguration | Select EnableSMB1Protocol'
      }
    ]
  },
  {
    name: '职业发展与软实力',
    icon: '🎯',
    desc: '会做还要会讲：简历、面试、述职的表达方式',
    items: [
      {
        t: '岗位画像与成长路径', lv: '必会', must: true,
        d: [
          '实施工程师：偏交付，重沟通、文档、现场解决问题；出差多，成长快',
          '系统运维/运维开发：偏稳定与效率，重自动化、监控、平台化',
          'DBA / 中间件 / 云原生 / 安全运维：垂直深耕方向',
          '路径：初级实施/运维（0-2 年）→ 中级（2-5 年，能独立负责项目）→ 高级/SRE/架构（5 年+，能设计体系）'
        ]
      },
      {
        t: '简历写法（STAR + 量化）', lv: '必会', must: true,
        d: [
          '每条经历用"动作 + 技术 + 结果"：把核心系统迁移到 K8s，发布耗时从 30 分钟降到 3 分钟',
          '量化口径：可用性、MTTR、自动化覆盖率、成本节省、故障数下降',
          '技能栏避免"精通一切"，按"熟练/熟悉/了解"分层，且经得起追问',
          '项目经验写清：项目背景、我的角色、技术栈、难点与方案、结果'
        ]
      },
      {
        t: '面试表达技巧', lv: '必会', must: true,
        d: [
          '技术题先给结论再展开，主动讲"为什么"和"踩过的坑"',
          '不会的题要诚实，给出排查思路与学习路径，比硬编造分高',
          '准备 3 个故事：一次救火、一次优化、一次跨团队协作，各 2 分钟版本与 5 分钟版本',
          '反问环节：问团队规模、值班机制、技术栈演进、考核口径'
        ]
      },
      {
        t: '认证与学习资源', lv: '加分',
        d: [
          '国内认可度较高：RHCE、HCIP/HCIE、阿里云 ACP、CKA/CKS、软考（系统集成/网络工程师）',
          '证书是敲门砖，项目经验与排障能力才是定价权',
          '学习方法：搭建实验环境（VMware/Vagrant/云主机）→ 复现故障 → 写复盘笔记',
          '输出倒逼输入：把每次实施写成博客/内部文档，形成个人知识库'
        ]
      }
    ]
  }
];
