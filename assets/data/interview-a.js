/* 面试题库 · 第一部分：操作系统基础 / Linux / 网络 / 存储 */
window.QUESTIONS = (window.QUESTIONS || []).concat([
  /* ================= 操作系统基础 ================= */
  { id: 1, mod: '操作系统基础', diff: '初级', q: '进程和线程的区别？协程又是什么？', tags: ['进程', '线程', '并发'],
    a: '<ul class="clean"><li><b>进程</b>是资源分配的最小单位，有独立地址空间；<b>线程</b>是 CPU 调度的最小单位，共享进程的堆和方法区，栈独立。</li><li>进程间通信要 IPC（管道、共享内存、socket）；线程间通信靠共享内存 + 同步机制。</li><li>线程切换比进程切换轻，但仍在用户态/内核态之间切换；<b>协程</b>是用户态调度的执行单元，切换不陷入内核，适合 IO 密集高并发。</li></ul>',
    tip: '能补一句"Java 里线程映射到内核线程（1:1），Go 的 goroutine 是 M:N 调度"会加分。' },

  { id: 2, mod: '操作系统基础', diff: '中级', q: '什么是虚拟内存？为什么需要它？', tags: ['内存', '页表', 'swap'],
    a: '<ul class="clean"><li>给每个进程一套独立的连续地址空间，由 MMU + 页表映射到物理页，屏蔽物理内存细节。</li><li>价值：隔离与安全、内存可超额分配（overcommit）、支持 swap 换出、便于内存映射文件（mmap）。</li><li>代价：页表开销、TLB miss、缺页中断；频繁换页会导致 thrashing（系统抖动）。</li></ul>' },

  { id: 3, mod: '操作系统基础', diff: '中级', q: 'Linux 里 free 显示内存快用完了，怎么判断是否真的有问题？', tags: ['free', 'buff/cache'],
    a: '<ul class="clean"><li>看 <code>free -h</code> 的 <b>available</b> 列，而不是 free 列；buff/cache 是可回收的。</li><li>结合 <code>vmstat 1</code> 看 si/so（swap 换入换出），持续非 0 说明内存真的紧张。</li><li>再看 <code>/proc/meminfo</code> 的 MemAvailable、Committed_AS；如果 available 充足但业务慢，问题不在内存。</li></ul>',
    tip: '面试官想确认你是否理解 buff/cache 与可用内存的区别。' },

  { id: 4, mod: '操作系统基础', diff: '中级', q: 'CPU 使用率不高但系统负载（load average）很高，怎么排查？', tags: ['负载', 'D 状态', 'IO'],
    a: '<ul class="clean"><li>load 统计的是运行队列 + 不可中断睡眠（D 状态）进程数，不等于 CPU 使用率。</li><li>先 <code>ps -eo stat,pid,cmd | grep " D"</code> 找 D 状态进程，再用 <code>iostat -x 1</code> 看是否 IO 打满。</li><li>常见原因：磁盘 IO 瓶颈、NFS 卡死、内存不足导致频繁换页、大量进程争抢同一把锁。</li><li>判断阈值：load 与核数比较，长期 &gt; 核数 1.5 倍要介入（4 核机器 load &gt; 6 需要关注）。</li></ul>',
    tip: '能说出"D 状态不可中断睡眠通常是被 IO 卡住"就是加分项。' },

  { id: 5, mod: '操作系统基础', diff: '中级', q: '什么是 OOM Killer？怎么避免业务进程被杀？', tags: ['OOM', 'cgroup', '内存'],
    a: '<ul class="clean"><li>内存耗尽时内核按 oom_score（结合 oom_score_adj）选择进程 kill，日志在 <code>dmesg -T | grep -i oom</code>。</li><li>避免手段：合理设置堆/缓存上限、限制容器 memory limit（超限是 cgroup OOM，退出码 137）、关键进程调低 oom_score_adj。</li><li>根因是内存泄漏或流量突增，OOM 只是结果；要加内存水位告警（如 available &lt; 10%）提前干预。</li></ul>' },

  { id: 6, mod: '操作系统基础', diff: '初级', q: '服务器 BIOS 自检通过但系统起不来，你的排查顺序？', tags: ['启动', 'grub', '救援'],
    a: '<ul class="clean"><li>看屏幕最后一行报错：找不到引导设备 / grub 报错 / 卡在某个服务。</li><li>单用户或救援模式进入：GRUB 编辑内核参数加 <code>rd.break</code> 或 <code>single</code>，检查 fstab、root 密码、磁盘健康。</li><li>常见原因：/etc/fstab 写错导致挂载失败、根分区满、grub 配置损坏、RAID 降级、内核升级后 initramfs 缺失。</li><li>处置后要 <code>mount -o remount,rw /</code> 才能改文件，改完 <code>grub2-mkconfig</code> 重建。</li></ul>' },

  { id: 7, mod: '操作系统基础', diff: '中级', q: '孤儿进程、僵尸进程分别是什么？怎么处理僵尸进程？', tags: ['进程', '僵尸'],
    a: '<ul class="clean"><li>父进程先退出，子进程被 init/systemd 收养 → 孤儿进程，无害。</li><li>子进程退出但父进程没 wait() 回收 → 僵尸进程（Z 状态），占用 PID 与少量内核结构，无法 kill。</li><li>处理：杀掉其父进程让 systemd 接管回收；或修父进程代码正确处理 SIGCHLD。</li></ul>',
    cmd: 'ps -eo stat,ppid,pid,cmd | awk \'$1 ~ /Z/\' ' },

  { id: 8, mod: '操作系统基础', diff: '中级', q: '一个请求从浏览器发出到服务端返回，经历了什么？', tags: ['全链路', 'DNS', 'TCP'],
    a: '<ul class="clean"><li>URL 解析 → DNS 解析（本地缓存 → hosts → 递归 DNS）→ TCP 三次握手（HTTPS 再加 TLS 握手）→ 发 HTTP 请求。</li><li>经过 CDN / WAF / 负载均衡（LVS→Nginx）→ 到达应用服务器 → 应用处理（缓存、DB、RPC）→ 返回响应。</li><li>连接复用或关闭（四次挥手 / keepalive），浏览器渲染。</li></ul>',
    tip: '这题是"全链路思维"的试金石，能主动分层讲就赢一半。' },

  /* ================= Linux ================= */
  { id: 9, mod: 'Linux', diff: '初级', q: 'Linux 常用目录的作用？/etc、/var、/proc、/opt 分别放什么？', tags: ['FHS'],
    a: '<ul class="clean"><li>/etc 配置文件；/var 可变数据（日志 /var/log、数据库、邮件）；/usr 系统程序与库；/opt 第三方软件；/home 用户家目录。</li><li>/proc 与 /sys 是内核暴露的虚拟文件系统，可读内核状态（如 /proc/meminfo、/proc/&lt;pid&gt;/）。</li><li>/tmp 全局可写、重启可能清理；/dev 设备文件。</li></ul>' },

  { id: 10, mod: 'Linux', diff: '初级', q: '软链接和硬链接的区别？', tags: ['inode'],
    a: '<ul class="clean"><li>硬链接指向同一 inode，不能跨文件系统、不能链目录，删除源文件数据仍在（link count 减 1）。</li><li>软链接是独立文件，内容是目标路径，可跨分区、可链目录，源文件删除后变成死链。</li><li>用 <code>ln</code>（硬）/ <code>ln -s</code>（软）创建，<code>ls -li</code> 看 inode 与链接数。</li></ul>' },

  { id: 11, mod: 'Linux', diff: '中级', q: '权限 rwx 对目录和文件的意义有何不同？', tags: ['权限', 'umask'],
    a: '<ul class="clean"><li>对文件：r 读内容、w 改内容、x 执行。</li><li>对目录：r 列出条目（ls）、w 创建/删除条目、x 进入目录（cd）与访问其下文件。</li><li>没有 x 只有 r 会出现"能 ls 到名字但 stat 失败"的经典现象。</li><li>umask 决定新建文件默认权限（文件 666-umask，目录 777-umask）。</li></ul>' },

  { id: 12, mod: 'Linux', diff: '中级', q: '磁盘显示还有空间，但写文件报 No space left on device，为什么？', tags: ['inode', '磁盘'],
    a: '<ul class="clean"><li>两种可能：<b>inode 耗尽</b>（大量小文件），用 <code>df -i</code> 确认，清理缓存/临时文件/邮件队列。</li><li>或<b>文件已删除但进程仍持有句柄</b>，空间不释放：<code>lsof +L1</code> 找到后用 <code>: &gt; /proc/&lt;pid&gt;/fd/&lt;n&gt;</code> 或重启进程。</li><li>也可能是配额（quota）或只读重新挂载（内核检测到文件系统错误）。</li></ul>',
    cmd: 'df -h; df -i\nlsof +L1 | head' },

  { id: 13, mod: 'Linux', diff: '初级', q: '如何查看某个端口被哪个进程占用？', tags: ['ss', 'netstat'],
    a: '<ul class="clean"><li>首选 <code>ss -lntp</code>（-l 监听、-n 数字、-t TCP、-p 进程），比 netstat 快。</li><li>老系统用 <code>netstat -tunlp | grep 8080</code>；已建立连接看 <code>ss -antp</code>。</li><li>没有权限看不到进程时用 sudo；容器里看宿主机端口要用 <code>nsenter</code> 或宿主机查 docker-proxy。</li></ul>' },

  { id: 14, mod: 'Linux', diff: '中级', q: '找出当前目录下最大的 10 个文件/目录，怎么写？', tags: ['du', 'find', 'awk'],
    a: '<ul class="clean"><li>文件：<code>find . -type f -printf "%s %p\\n" | sort -rn | head -10</code></li><li>目录：<code>du -sh * | sort -rh | head -10</code>（注意 du 会遍历，大目录较慢）</li><li>全盘定位：<code>du -x -h --max-depth=1 / | sort -rh | head</code>，逐层下钻。</li></ul>',
    cmd: 'du -sh * 2>/dev/null | sort -rh | head -10\nfind / -xdev -type f -size +1G -exec ls -lh {} \\;' },

  { id: 15, mod: 'Linux', diff: '中级', q: '统计 Nginx 访问日志中访问量 Top10 的 IP，用 awk 怎么写？', tags: ['awk', '日志分析'],
    a: '<ul class="clean"><li><code>awk \'{print $1}\' access.log | sort | uniq -c | sort -rn | head -10</code></li><li>统计 5xx 请求：<code>awk \'$9 ~ /^5/ {print $1}\' access.log | sort | uniq -c | sort -rn</code></li><li>按小时统计 QPS：先 cut 时间字段再 uniq -c。</li></ul>',
    cmd: 'awk \'{print $1}\' access.log | sort | uniq -c | sort -rn | head -10\nawk \'{print $7}\' access.log | sort | uniq -c | sort -rn | head' },

  { id: 16, mod: 'Linux', diff: '中级', q: '写一个 shell 脚本：批量检查 100 台机器的磁盘使用率，超过 85% 发告警。', tags: ['shell', '巡检'],
    a: '<ul class="clean"><li>要点：<code>set -euo pipefail</code>、ip 列表文件、并发（xargs -P 或后台任务+wait）、超时控制。</li><li>取数：<code>ssh host "df -P / | tail -1 | awk \'{gsub(/%/,\"\",$5); print $5}\'"</code></li><li>告警：curl 钉钉/企微 webhook，或写文件汇总后统一发送；失败重试 2 次并记录。</li><li>面试时把"幂等、超时、日志、并发、汇总"讲出来即可拿分。</li></ul>',
    cmd: 'while read ip; do\n  u=$(ssh -o ConnectTimeout=5 $ip "df -P / | tail -1 | awk \'{gsub(/%/,\\\"\\\",$5);print $5}\'")\n  [ "$u" -ge 85 ] && echo "ALERT $ip $u%"\ndone < hosts.txt' },

  { id: 17, mod: 'Linux', diff: '中级', q: 'cron 定时任务到点没执行，怎么排查？', tags: ['cron', '定时任务'],
    a: '<ul class="clean"><li>看 <code>/var/log/cron</code> 是否有执行记录；没有说明任务未加载（格式错误/未 reload crond）。</li><li>有记录但业务没效果：检查脚本权限、shebang、<b>环境变量（PATH 缺失最常见）</b>、相对路径。</li><li>手工 <code>sh -x script.sh</code> 复现；脚本里统一用绝对路径并 source /etc/profile。</li></ul>',
    tip: '能说出 PATH 问题基本就答到点上了。' },

  { id: 18, mod: 'Linux', diff: '高级', q: '如何排查一个进程 CPU 100%？', tags: ['CPU', 'jstack', 'perf'],
    a: '<ul class="clean"><li><code>top</code> 定位进程 → <code>top -Hp &lt;pid&gt;</code> 定位线程 → <code>printf "%x\\n" &lt;tid&gt;</code> 转十六进制。</li><li>Java：<code>jstack &lt;pid&gt; | grep -A 30 "nid=0x&lt;hex&gt;"</code> 看调用栈；C/C++：<code>pstack &lt;pid&gt;</code> 或 <code>perf top -p</code>。</li><li>区分 us 高（业务死循环/计算密集/正则回溯）与 sy 高（系统调用、上下文切换、锁竞争）。</li><li>应急：先限流或摘流，再处理；事后加监控与代码审查。</li></ul>' },

  { id: 19, mod: 'Linux', diff: '中级', q: '如何查看和修改系统最大文件描述符数？', tags: ['ulimit', '句柄'],
    a: '<ul class="clean"><li>查看：<code>ulimit -n</code>（当前 shell）、<code>cat /proc/&lt;pid&gt;/limits</code>（进程生效值）。</li><li>临时：<code>ulimit -n 65535</code>；永久改 <code>/etc/security/limits.d/99-nofile.conf</code>（nofile soft/hard）并重登。</li><li>系统级 <code>fs.file-max</code>、<code>fs.nr_open</code> 也要同步调大；systemd 服务需配 <code>LimitNOFILE=65535</code>。</li></ul>',
    cmd: 'ulimit -n\ncat /proc/$(pgrep nginx | head -1)/limits | grep files\nsysctl fs.file-max fs.nr_open' },

  { id: 20, mod: 'Linux', diff: '中级', q: 'systemd 服务起不来，怎么定位？', tags: ['systemd', 'journalctl'],
    a: '<ul class="clean"><li><code>systemctl status xxx</code> 看退出码与最后几行；<code>journalctl -u xxx -n 100 --no-pager</code> 看完整日志。</li><li>常见：ExecStart 路径错、User 无权限、端口被占、环境变量缺失、SELinux 拦截（看 audit.log）。</li><li>单元文件改后必须 <code>systemctl daemon-reload</code>；<code>systemd-analyze verify xxx.service</code> 校验语法。</li></ul>' },

  { id: 21, mod: 'Linux', diff: '中级', q: 'rsync 和 scp 的区别？生产上怎么用？', tags: ['rsync', '同步'],
    a: '<ul class="clean"><li>scp 是全量复制（走 SSH），简单但大目录慢；rsync 基于差异算法做增量，支持断点续传、排除、删除同步、限速。</li><li>常用：<code>rsync -avz --progress --exclude=logs/ src/ user@host:/data/</code></li><li>小心 <code>--delete</code>（源端删了目标也删），先用 <code>--dry-run</code> 验证。</li><li>大量小文件建议加 tar 打包传输，或改用 inotify + rsync 实时同步。</li></ul>' },

  { id: 22, mod: 'Linux', diff: '高级', q: '服务器被暴力破解 SSH，你从发现到加固怎么做？', tags: ['安全', 'ssh', 'fail2ban'],
    a: '<ul class="clean"><li>发现：<code>lastb | head</code>、<code>journalctl -u sshd | grep "Failed password" | wc -l</code>、secure 日志统计来源 IP。</li><li>应急处置：改端口 + 禁止 root 直登 + 仅密钥登录，防火墙限制来源网段，<code>fail2ban</code> 自动封禁。</li><li>确认是否已被突破：看登录成功记录、新增账号、crontab、suid 文件、异常外联。</li><li>长期：跳板机/堡垒机统一入口，公网不暴露 22，加登录告警。</li></ul>' },

  { id: 23, mod: 'Linux', diff: '中级', q: 'iptables 的四表五链是什么？如何只放行 80/443？', tags: ['iptables', '防火墙'],
    a: '<ul class="clean"><li>表：filter（默认）、nat、mangle、raw；链：PREROUTING、INPUT、FORWARD、OUTPUT、POSTROUTING。</li><li>规则：<code>iptables -A INPUT -p tcp -m multiport --dports 80,443 -j ACCEPT</code>，再放行已建立连接 <code>-m state --state ESTABLISHED,RELATED -j ACCEPT</code>，最后 DROP 默认策略。</li><li>顺序很重要（自上而下匹配），改完 <code>iptables-save</code> 持久化，否则重启失效。</li><li>注意别把自己 SSH 关在门外——先加放行规则再改默认策略。</li></ul>' },

  /* ================= 网络 ================= */
  { id: 24, mod: '网络', diff: '初级', q: 'TCP 三次握手和四次挥手的过程？为什么是三次、四次？', tags: ['TCP', '握手'],
    a: '<ul class="clean"><li>三次握手：客户端 SYN(seq=x) → 服务端 SYN+ACK(seq=y, ack=x+1) → 客户端 ACK(ack=y+1)。</li><li>三次是为了双向确认收发能力并同步初始序列号；两次无法确认客户端的接收能力。</li><li>四次挥手：主动方 FIN → 对方 ACK → 对方数据发完再 FIN → 主动方 ACK，最后 TIME_WAIT 等 2MSL。</li><li>为什么四次：TCP 全双工，两个方向要各自关闭，且被动方可能还有数据要发（半关闭）。</li></ul>' },

  { id: 25, mod: '网络', diff: '中级', q: '大量 TIME_WAIT 和大量 CLOSE_WAIT 分别说明什么？怎么处理？', tags: ['TIME_WAIT', 'CLOSE_WAIT'],
    a: '<ul class="clean"><li>TIME_WAIT 是主动关闭方正常状态，等 2MSL 保证最后 ACK 送达。短连接多必然多，可用长连接、<code>tcp_tw_reuse=1</code>、调大 <code>ip_local_port_range</code>。</li><li>CLOSE_WAIT 是<b>被动关闭方没收尾</b>，通常是对端已发 FIN 而本端程序没 close()——应用 bug 或连接池未释放，要改代码，调内核参数没用。</li><li>用 <code>ss -ant | awk \'{print $1}\' | sort | uniq -c</code> 快速统计。</li></ul>',
    tip: '这题几乎必问，能区分"内核参数 vs 应用 bug"是关键。' },

  { id: 26, mod: '网络', diff: '中级', q: 'HTTPS 的握手过程？证书校验是怎么做的？', tags: ['HTTPS', 'TLS', '证书'],
    a: '<ul class="clean"><li>ClientHello（支持的版本、加密套件、随机数）→ ServerHello + 证书链 → 客户端校验证书（域名、有效期、签发链、吊销）→ 密钥交换（ECDHE）→ 双方生成会话密钥 → 加密通信。</li><li>RSA 密钥交换无前向安全，ECDHE 有；TLS1.3 简化为 1-RTT。</li><li>排障：<code>openssl s_client -connect host:443 -servername host</code> 看证书链与过期时间；证书过期/中间证书缺失是 502/ERR_CERT 的常见原因。</li></ul>' },

  { id: 27, mod: '网络', diff: '中级', q: 'HTTP 状态码 301/302/304/401/403/502/504 分别什么含义？', tags: ['HTTP', '状态码'],
    a: '<ul class="clean"><li>301 永久重定向（会缓存）、302 临时重定向、304 协商缓存命中（Not Modified）。</li><li>401 未认证、403 无权限、404 不存在、405 方法不允许。</li><li>502 Bad Gateway：后端返回了非法响应或连不上（Nginx 到上游失败）；504 Gateway Timeout：上游超时。</li><li>499 是 Nginx 私有码，表示客户端主动断开（常见于后端太慢用户取消）。</li></ul>' },

  { id: 28, mod: '网络', diff: '中级', q: '客户端说"访问不了系统"，你如何一步步定位？', tags: ['排障', '分层'],
    a: '<ul class="clean"><li>先界定范围：只有他不行还是所有人？只有这个功能还是整站？内网还是公网？</li><li>分层验证：DNS 解析 → ping 通不通 → telnet/nc 端口 → curl -v 看状态码与耗时 → 查 Nginx 日志、应用日志。</li><li>若应用正常但用户不通，查 WAF/防火墙/安全组/客户端 hosts/代理。</li><li>保留证据：抓包、日志时间点、traceId，避免"好了就没事了"。</li></ul>' },

  { id: 29, mod: '网络', diff: '高级', q: '什么是 MTU 黑洞？现象和解决方式？', tags: ['MTU', '分片', 'VPN'],
    a: '<ul class="clean"><li>路径中某段 MTU 更小且 ICMP 分片需要报文被过滤，导致大包被静默丢弃：表现为小请求正常、大文件/大响应卡住、SSH 登录后卡死。</li><li>验证：<code>ping -M do -s 1472 host</code> 逐步减小包长找到可用 MTU。</li><li>解决：调小接口 MTU（如 1400）、开启 MSS clamping（iptables TCPMSS --clamp-mss-to-pmtu）、放行 ICMP。</li></ul>' },

  { id: 30, mod: '网络', diff: '中级', q: 'LVS 的 DR/NAT/TUN 模式区别？为什么 DR 性能最好？', tags: ['LVS', '负载均衡'],
    a: '<ul class="clean"><li>NAT：请求和响应都经过 LB，LB 是瓶颈，需改目标地址。</li><li>DR：改写目的 MAC，响应由 RS 直接回客户端，LB 只处理入向流量，吞吐最高；要求 LB 与 RS 同网段、RS 回环配 VIP 并抑制 ARP。</li><li>TUN：IP 隧道跨机房，RS 需支持隧道解封装。</li><li>七层场景仍用 Nginx/HAProxy，四层高性能用 LVS。</li></ul>' },

  { id: 31, mod: '网络', diff: '中级', q: 'keepalived 双机主备的原理？脑裂怎么防？', tags: ['keepalived', 'VRRP', '高可用'],
    a: '<ul class="clean"><li>基于 VRRP：主备通过组播心跳通告优先级，主挂了备提升优先级并接管 VIP。</li><li>脑裂：心跳链路断但两台都活着，都认为自己该持有 VIP → 双主写数据。防范：冗余心跳线、<code>nopreempt</code>、脚本检测（VIP 冲突时主动降级）、仲裁设备。</li><li>注意：keepalived 只管 VIP，业务切换要靠脚本（重启服务/切库）。</li></ul>' },

  { id: 32, mod: '网络', diff: '初级', q: 'DNS 解析的过程？域名改了多久生效？', tags: ['DNS', 'TTL'],
    a: '<ul class="clean"><li>浏览器缓存 → 系统缓存/hosts → 本地 DNS（递归）→ 根 → 顶级域 → 权威 NS → 返回并逐级缓存。</li><li>生效时间取决于 TTL，切换前把 TTL 调小（如 60s）可以减少等待。</li><li>排查：<code>dig +trace</code> 看解析链路，<code>dig @8.8.8.8</code> 对比不同 DNS 结果，检查是否有本地 hosts 干扰。</li></ul>' },

  { id: 33, mod: '网络', diff: '中级', q: '如何用 tcpdump 抓取指定 IP 和端口的包并分析？', tags: ['tcpdump', '抓包'],
    a: '<ul class="clean"><li><code>tcpdump -i any -nn host 10.0.0.5 and port 8080 -w /tmp/x.pcap</code>，再拉回 Wireshark 分析。</li><li>看什么：三次握手是否完成（有无 SYN 无 SYN+ACK → 防火墙/服务未起）、有无 RST、重传、零窗口。</li><li>生产注意：抓包有性能与磁盘开销，加 <code>-c</code> 限制包数、<code>-s 0</code> 抓全包、尽快落盘。</li></ul>' },

  { id: 34, mod: '网络', diff: '中级', q: 'Nginx 反向代理后，应用拿到的客户端 IP 都是 LB 的，怎么解决？', tags: ['X-Forwarded-For', 'Nginx'],
    a: '<ul class="clean"><li>LB 上设置 <code>proxy_set_header X-Real-IP $remote_addr; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</code></li><li>应用侧按可信代理列表从 XFF 中取最右侧非代理 IP，不能直接信任客户端伪造的头。</li><li>Nginx 也可用 realip 模块：<code>set_real_ip_from 10.0.0.0/8; real_ip_header X-Forwarded-For;</code> 让日志记录真实 IP。</li></ul>' },

  { id: 35, mod: '网络', diff: '高级', q: '跨网段访问不通，可能是哪些原因？', tags: ['路由', 'VLAN', '安全组'],
    a: '<ul class="clean"><li>路由缺失/回程路由不通（去程通不代表回程通，重点查对端网关）。</li><li>防火墙/安全组/ACL 双向未放行；NAT 规则缺失。</li><li>VLAN 未打通、子网掩码配错导致判断同网段直连而实际不通。</li><li>排查：<code>ip r</code> → <code>traceroute</code> → 网关侧抓包，看包到没到、回没回。</li></ul>' },

  /* ================= 存储 ================= */
  { id: 36, mod: '存储', diff: '初级', q: 'RAID 0/1/5/6/10 有什么区别？生产怎么选？', tags: ['RAID'],
    a: '<ul class="clean"><li>RAID0 条带无冗余、性能最高；RAID1 镜像容量减半、可坏一块；RAID5 允许坏 1 块、写惩罚明显；RAID6 允许坏 2 块；RAID10 先镜像再条带，性能与可靠性兼顾但容量利用率 50%。</li><li>数据库/高 IO 场景优先 RAID10；日志、备份可用 RAID5/6；系统盘可 RAID1。</li><li>重建（rebuild）期间性能下降且再坏一块就丢数据，关键系统要配热备盘并监控 RAID 状态。</li></ul>' },

  { id: 37, mod: '存储', diff: '中级', q: 'LVM 在线扩容的完整步骤？', tags: ['LVM', '扩容'],
    a: '<ul class="clean"><li>加盘/扩分区 → <code>pvcreate /dev/sdb</code> → <code>vgextend vg /dev/sdb</code> → <code>lvextend -l +100%FREE /dev/vg/lv</code> → 扩文件系统。</li><li>xfs：<code>xfs_growfs /data</code>（只能扩不能缩）；ext4：<code>resize2fs /dev/vg/lv</code>（缩容需先 umount）。</li><li>全程在线不影响业务，但要确认有 PE 余量与备份。</li></ul>',
    cmd: 'pvcreate /dev/sdb\nvgextend vg_data /dev/sdb\nlvextend -l +100%FREE /dev/vg_data/lv_app\nxfs_growfs /data' },

  { id: 38, mod: '存储', diff: '中级', q: '备份策略怎么设计？什么是 RPO 和 RTO？', tags: ['备份', '3-2-1', 'RPO'],
    a: '<ul class="clean"><li>RPO：最多能容忍丢多少数据（决定备份频率/binlog 保留）；RTO：多久必须恢复业务（决定备份方式与演练熟练度）。</li><li>3-2-1 原则：3 份副本、2 种介质、1 份异地；全量 + 增量 + 日志备份组合。</li><li>备份必须定期做恢复演练并记录耗时；备份失败要告警，不然等于没备。</li><li>防勒索：备份介质离线/不可变存储，备份账号与生产隔离。</li></ul>' },

  { id: 39, mod: '存储', diff: '中级', q: 'NFS 挂载后应用经常卡死，怎么排查和规避？', tags: ['NFS', '挂载'],
    a: '<ul class="clean"><li>NFS 服务端不可达时，客户端默认 hard 挂载会一直重试，导致访问该目录的进程进入 D 状态。</li><li>排查：<code>mount | grep nfs</code>、<code>showmount -e server</code>、服务端 <code>/var/log/messages</code>、网络丢包。</li><li>规避：改用 <code>hard,timeo=600,retrans=2</code> 或 <code>soft</code>（有数据风险）、应用层超时、核心业务避免强依赖 NFS（改本地盘 + 同步）。</li></ul>' },

  { id: 40, mod: '存储', diff: '初级', q: 'SSD 和机械盘在运维上的差异？', tags: ['SSD', 'IO'],
    a: '<ul class="clean"><li>SSD 随机 IOPS 高、无寻道，但写放大与寿命（TBW）需要关注，TRIM/discard 要开启。</li><li>SSD 坏盘往往"突然死亡"而非逐渐降速，SMART 与冗余更关键。</li><li>文件系统与调度器可优化：noop/none 调度、ext4/xfs 对齐、避免碎片化整理。</li><li>数据库场景 SSD 对 QPS 提升明显，但瓶颈常转移到 CPU 或锁。</li></ul>' }
]);
