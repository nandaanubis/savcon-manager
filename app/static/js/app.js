/* Savcon Manager - Frontend SPA (vanilla JS, multi-language) */
const API = '/api';
const APP = { name: 'Savcon Manager', version: '1.0.1', release: '2026.11.23', author: 'Nanda Anubis' };
const QUOTE = 'App ini dibuat secara gabut dan dilahirkan secara suka suka. Mungkin App ini anomaly tapi percaya lah ini berfungsi sebagai mana mestinya - Nanda Anubis & AI POWER';
const LANGS = [['id','Indonesia'],['en','English'],['es','Español'],['zh','中文'],['pt','Português']];

const state = {
  token: localStorage.getItem('savcon_token') || '',
  lang: localStorage.getItem('savcon_lang_v2') || 'en',
  user: null, settings: null, page: 'dashboard',
  devices: [], groups: [], backups: [], users: [], activity: [], dashboard: null,
  search: '', filterGroup: '', backupFilter: '', bg: 'aurora', loginOpacity: 72, modalCtx: {},
};

/* ---------------- translations ---------------- */
const I18N = {
id:{
 'login.tagline':'NETWORK CONFIGURATION BACKUP','login.title':'Selamat datang kembali','login.sub':'Masuk untuk mengelola backup konfigurasi perangkat Anda.',
 'login.user':'Username','login.pass':'Password','login.submit':'Masuk ke Dashboard','login.bg':'Tampilan latar login','login.language':'Bahasa / Language',
 'common.cancel':'Batal','login.default':'Default:','login.change':'ganti password setelah login',
 'nav.menu':'MENU UTAMA','nav.dashboard':'Dashboard','nav.devices':'Devices','nav.groups':'Groups','nav.backups':'Backups','nav.settings':'Settings','nav.users':'Users','nav.activity':'Activity Log','nav.online':'System Online','nav.about':'Tentang','title.about':'Tentang','sub.about':'Tentang aplikasi & kredit','about.quoteLabel':'Kata Pembuat',
 'top.refresh':'Refresh status perangkat','top.pass':'Ganti Password','top.logout':'Logout',
 'title.dashboard':'Dashboard','sub.dashboard':'Ringkasan kondisi sistem & perangkat','title.devices':'Devices','sub.devices':'Kelola perangkat dan koneksi backup',
 'title.groups':'Groups','sub.groups':'Grup perangkat untuk backup terkelola','title.backups':'Backups','sub.backups':'Arsip konfigurasi perangkat',
 'title.settings':'Settings','sub.settings':'Konfigurasi storage, automasi & tampilan','title.users':'Users','sub.users':'Kelola pengguna aplikasi',
 'title.activity':'Activity Log','sub.activity':'Riwayat aktivitas pengguna',
 'dash.hero':'Selamat datang di Savcon Manager','dash.heroText':'Backup konfigurasi MikroTik (RouterOS v6/v7), Cisco, Dell FTOS, dan Alcatel dalam satu tempat. Otomatis dengan cron, kirim ke local, email, Google Drive, atau SFTP.',
 'dash.backupAll':'Backup Semua Sekarang','dash.manage':'Kelola Perangkat','dash.cron':'Atur Cron',
 'dash.total':'Total Perangkat','dash.online':'Perangkat Online','dash.backups':'Total Backup','dash.failed':'Backup Gagal',
 'dash.groups':'grup','dash.live':'live','dash.files':'file','dash.offline':'offline',
 'dash.dist':'Distribusi Perangkat','dash.distSub':'Berdasarkan tipe perangkat','dash.noDevices':'Belum ada perangkat.','dash.recent':'Backup Terbaru','dash.recentSub':'Aktivitas backup terakhir','dash.viewAll':'Lihat semua','dash.noBackups':'Belum ada backup.',
 'dev.search':'Cari nama atau IP...','dev.allGroups':'Semua Grup','dev.refresh':'Refresh Status','dev.backupSel':'Backup Terpilih','dev.add':'Tambah Device',
 'dev.col.device':'Device','dev.col.group':'Grup','dev.col.type':'Tipe','dev.col.conn':'Koneksi','dev.col.ver':'Versi OS','dev.col.status':'Status','dev.col.last':'Backup Terakhir','dev.col.act':'Aksi',
 'dev.retention':'retensi: {n} file','dev.noGroup':'Tanpa Grup','dev.empty':'Tidak ada device. Klik Tambah Device untuk mulai.',
 'dev.test':'Test koneksi','dev.backup':'Backup sekarang','dev.edit':'Edit','dev.delete':'Hapus',
 'dev.new':'Tambah Device Baru','dev.editTitle':'Edit Device','dev.general':'Informasi Umum','dev.connSec':'Koneksi & Autentikasi','dev.storeSec':'Backup & Penyimpanan',
 'dev.name':'Nama Device','dev.group':'Grup','dev.host':'Host / IP','dev.port':'Port','dev.type':'Tipe Perangkat','dev.conn':'Metode Akses','dev.user':'Username','dev.pass':'Password','dev.passHint':'kosongkan jika tidak diubah',
 'dev.ret':'Maks. Retention (1-10)','dev.retHint':'Jumlah file backup terakhir yang disimpan','dev.store':'Tujuan Penyimpanan','dev.sensitive':'Sertakan password sensitif (PPP, dll)','dev.sensitiveHint':'/export show-sensitive — membutuhkan policy sensitive di RouterOS',
 'dev.enabled':'Aktifkan device untuk backup otomatis','dev.notes':'Catatan','dev.notesPh':'Informasi tambahan...','dev.save':'Simpan Device',
 'types.mikrotik':'MikroTik RouterOS','types.cisco':'Cisco IOS','types.dell_ftos':'Dell FTOS','types.alcatel':'Alcatel OS',
 'store.local':'Local','store.email':'Email','store.gdrive':'Google Drive','store.sftp':'SFTP','store.all':'Semua (Local + Email + GDrive + SFTP)',
 'grp.title':'Device Groups','grp.sub':'Kelompokkan perangkat untuk backup per-grup','grp.add':'Tambah Group','grp.desc':'Tidak ada deskripsi','grp.count':'{n} device','grp.empty':'Belum ada group. Tambahkan group seperti Mikrotik Client atau Mikrotik Core.','grp.new':'Tambah Group','grp.editTitle':'Edit Group','grp.name':'Nama Group','grp.descL':'Deskripsi',
 'bk.all':'Semua Device','bk.backupAll':'Backup Semua','bk.refresh':'Refresh','bk.col.device':'Device','bk.col.file':'Filename','bk.col.size':'Ukuran','bk.col.store':'Storage','bk.col.status':'Status','bk.col.time':'Waktu','bk.col.act':'Aksi','bk.empty':'Belum ada backup ditemukan.','bk.view':'Lihat','bk.download':'Download',
 'set.general':'Umum','set.storage':'Penyimpanan','set.auto':'Automasi (Cron)','set.appearance':'Tampilan',
 'set.appName':'Nama Aplikasi','set.tz':'Zona Waktu','set.defaultCreds':'Kredensial default: admin / admin123. Segera ganti melalui menu Users → Ganti Password.',
 'set.about':'Informasi Release','set.ver':'Versi Release','set.date':'Tanggal Release','set.author':'Author',
 'set.smtp':'Email (SMTP)','set.smtpDesc':'Kirim backup sebagai lampiran email','set.host':'Host','set.port':'Port','set.user':'Username','set.pass':'Password / App Password','set.from':'From','set.to':'To (pisahkan dengan koma)','set.tls':'Gunakan STARTTLS','set.active':'Aktif','set.test':'Test',
 'set.sftp':'SFTP','set.sftpDesc':'Upload backup ke server SFTP','set.path':'Remote Path',
 'set.gdrive':'Google Drive','set.gdriveDesc':'Upload via Service Account JSON','set.folder':'Folder ID (opsional)','set.creds':'Service Account JSON','set.credsHint':'Paste seluruh isi file JSON service account. Bagikan folder Drive ke email service account.',
 'set.autoOn':'Auto Backup aktif','set.autoOnDesc':'Jalankan backup otomatis sesuai jadwal cron','set.cron':'Cron Expression','set.cronHint':'Format: menit jam hari bulan hari-minggu','set.filter':'Filter Grup (optional)','set.filterHint':'Kosongkan untuk semua device. Pisahkan ID grup dengan koma.','set.examples':'Contoh cron:','set.every2':'setiap jam 02.00','set.every15':'setiap 15 menit','set.every820':'jam 08.00 & 20.00','set.weekly':'setiap Minggu','set.runNow':'Jalankan Sekarang',
 'set.bgTitle':'Background Halaman Login','set.bgDesc':'Pilih gradasi modern atau upload gambar sendiri. Berlaku langsung untuk semua pengguna.','set.opacity':'Opacitas Kartu Login','set.opacityHint':'Atur transparansi kartu login: 0% = transparan, 100% = pekat. Berlaku setelah disimpan.','set.preview':'Pratinjau kartu login','set.save':'Simpan Semua Pengaturan',
 'us.title':'Manajemen User','us.sub':'Tambah pengguna & ubah password','us.mine':'Ganti Password Saya','us.add':'Tambah User','us.col.user':'Username','us.col.role':'Role','us.col.created':'Dibuat','us.col.act':'Aksi','us.your':'Akun Anda',
 'us.new':'Tambah User','us.roleUser':'User','us.roleAdmin':'Admin','us.changeTitle':'Ganti Password','us.old':'Password Lama','us.newp':'Password Baru','us.confirm':'Ulangi Password Baru','us.update':'Update Password',
 'act.title':'Activity Log','act.sub':'Riwayat 100 aktivitas terakhir','act.time':'Waktu','act.user':'User','act.act':'Aksi','act.detail':'Detail','act.empty':'Belum ada aktivitas.',
 'm.selDevice':'Pilih minimal satu device','m.testing':'Menguji koneksi...','m.okConn':'Koneksi OK','m.backing':'Membackup konfigurasi...','m.okBackup':'Backup berhasil','m.runBackup':'Menjalankan backup semua device...','m.doneBackup':'Selesai: {s} berhasil, {f} gagal','m.groupBackup':'Membackup device dalam group...','m.groupDone':'Backup group selesai: {s} berhasil, {f} gagal','m.status':'Memperbarui status...','m.statusDone':'Status diperbarui','m.welcome':'Selamat datang','m.deleted':'dihapus','m.saved':'disimpan','m.added':'ditambahkan','m.updated':'diperbarui','m.wrongPass':'Password lama salah','m.mismatch':'Password baru tidak cocok','m.passChanged':'Password berhasil diubah','m.downloaded':'Backup diunduh','m.uploadOk':'Background berhasil diupload','m.loadErr':'Gagal memuat','m.defaultGroup':'Tidak ada deskripsi',
},
en:{
 'login.tagline':'NETWORK CONFIGURATION BACKUP','login.title':'Welcome back','login.sub':'Sign in to manage your device configuration backups.',
 'login.user':'Username','login.pass':'Password','login.submit':'Sign in to Dashboard','login.bg':'Login background','login.language':'Language',
 'common.cancel':'Cancel','login.default':'Default:','login.change':'change password after login',
 'nav.menu':'MAIN MENU','nav.dashboard':'Dashboard','nav.devices':'Devices','nav.groups':'Groups','nav.backups':'Backups','nav.settings':'Settings','nav.users':'Users','nav.activity':'Activity Log','nav.online':'System Online','nav.about':'About','title.about':'About','sub.about':'About the app & credits','about.quoteLabel':'Author Quote',
 'top.refresh':'Refresh device status','top.pass':'Change Password','top.logout':'Logout',
 'title.dashboard':'Dashboard','sub.dashboard':'System and device overview','title.devices':'Devices','sub.devices':'Manage devices and backup connections',
 'title.groups':'Groups','sub.groups':'Device groups for managed backups','title.backups':'Backups','sub.backups':'Device configuration archive',
 'title.settings':'Settings','sub.settings':'Storage, automation and appearance','title.users':'Users','sub.users':'Manage application users',
 'title.activity':'Activity Log','sub.activity':'User activity history',
 'dash.hero':'Welcome to Savcon Manager','dash.heroText':'Backup MikroTik (RouterOS v6/v7), Cisco, Dell FTOS and Alcatel configuration in one place. Schedule with cron and deliver to local, email, Google Drive or SFTP.',
 'dash.backupAll':'Backup All Now','dash.manage':'Manage Devices','dash.cron':'Configure Cron',
 'dash.total':'Total Devices','dash.online':'Online Devices','dash.backups':'Total Backups','dash.failed':'Failed Backups',
 'dash.groups':'groups','dash.live':'live','dash.files':'files','dash.offline':'offline',
 'dash.dist':'Device Distribution','dash.distSub':'By device type','dash.noDevices':'No devices yet.','dash.recent':'Recent Backups','dash.recentSub':'Latest backup activity','dash.viewAll':'View all','dash.noBackups':'No backups yet.',
 'dev.search':'Search name or IP...','dev.allGroups':'All Groups','dev.refresh':'Refresh Status','dev.backupSel':'Backup Selected','dev.add':'Add Device',
 'dev.col.device':'Device','dev.col.group':'Group','dev.col.type':'Type','dev.col.conn':'Connection','dev.col.ver':'OS Version','dev.col.status':'Status','dev.col.last':'Last Backup','dev.col.act':'Actions',
 'dev.retention':'retention: {n} files','dev.noGroup':'No Group','dev.empty':'No devices. Click Add Device to start.',
 'dev.test':'Test connection','dev.backup':'Backup now','dev.edit':'Edit','dev.delete':'Delete',
 'dev.new':'Add New Device','dev.editTitle':'Edit Device','dev.general':'General Information','dev.connSec':'Connection & Authentication','dev.storeSec':'Backup & Storage',
 'dev.name':'Device Name','dev.group':'Group','dev.host':'Host / IP','dev.port':'Port','dev.type':'Device Type','dev.conn':'Access Method','dev.user':'Username','dev.pass':'Password','dev.passHint':'leave empty to keep current',
 'dev.ret':'Max. Retention (1-10)','dev.retHint':'Number of recent backup files to keep','dev.store':'Storage Target','dev.sensitive':'Include sensitive passwords (PPP, etc)','dev.sensitiveHint':'/export show-sensitive — requires sensitive policy on RouterOS',
 'dev.enabled':'Enable device for automatic backup','dev.notes':'Notes','dev.notesPh':'Additional information...','dev.save':'Save Device',
 'types.mikrotik':'MikroTik RouterOS','types.cisco':'Cisco IOS','types.dell_ftos':'Dell FTOS','types.alcatel':'Alcatel OS',
 'store.local':'Local','store.email':'Email','store.gdrive':'Google Drive','store.sftp':'SFTP','store.all':'All (Local + Email + GDrive + SFTP)',
 'grp.title':'Device Groups','grp.sub':'Group devices for managed backups','grp.add':'Add Group','grp.desc':'No description','grp.count':'{n} devices','grp.empty':'No groups yet. Add groups like Mikrotik Client or Mikrotik Core.','grp.new':'Add Group','grp.editTitle':'Edit Group','grp.name':'Group Name','grp.descL':'Description',
 'bk.all':'All Devices','bk.backupAll':'Backup All','bk.refresh':'Refresh','bk.col.device':'Device','bk.col.file':'Filename','bk.col.size':'Size','bk.col.store':'Storage','bk.col.status':'Status','bk.col.time':'Time','bk.col.act':'Actions','bk.empty':'No backups found.','bk.view':'View','bk.download':'Download',
 'set.general':'General','set.storage':'Storage','set.auto':'Automation (Cron)','set.appearance':'Appearance',
 'set.appName':'Application Name','set.tz':'Timezone','set.defaultCreds':'Default credentials: admin / admin123. Change them in Users → Change Password.',
 'set.about':'Release Information','set.ver':'Version','set.date':'Release Date','set.author':'Author',
 'set.smtp':'Email (SMTP)','set.smtpDesc':'Send backups as email attachments','set.host':'Host','set.port':'Port','set.user':'Username','set.pass':'Password / App Password','set.from':'From','set.to':'To (comma separated)','set.tls':'Use STARTTLS','set.active':'Enabled','set.test':'Test',
 'set.sftp':'SFTP','set.sftpDesc':'Upload backups to an SFTP server','set.path':'Remote Path',
 'set.gdrive':'Google Drive','set.gdriveDesc':'Upload via Service Account JSON','set.folder':'Folder ID (optional)','set.creds':'Service Account JSON','set.credsHint':'Paste the full service account JSON. Share the Drive folder with the service account email.',
 'set.autoOn':'Auto Backup enabled','set.autoOnDesc':'Run automatic backups on the cron schedule','set.cron':'Cron Expression','set.cronHint':'Format: minute hour day month weekday','set.filter':'Group Filter (optional)','set.filterHint':'Leave empty for all devices. Separate group IDs with commas.','set.examples':'Cron examples:','set.every2':'every day at 02:00','set.every15':'every 15 minutes','set.every820':'at 08:00 & 20:00','set.weekly':'every Sunday','set.runNow':'Run Now',
 'set.bgTitle':'Login Background','set.bgDesc':'Pick a modern gradient or upload your own image. Applies to all users immediately.','set.opacity':'Login Card Opacity','set.opacityHint':'Set login card transparency: 0% = transparent, 100% = solid. Applies after saving.','set.preview':'Login card preview','set.save':'Save All Settings',
 'us.title':'User Management','us.sub':'Add users & change passwords','us.mine':'Change My Password','us.add':'Add User','us.col.user':'Username','us.col.role':'Role','us.col.created':'Created','us.col.act':'Actions','us.your':'Your account',
 'us.new':'Add User','us.roleUser':'User','us.roleAdmin':'Admin','us.changeTitle':'Change Password','us.old':'Current Password','us.newp':'New Password','us.confirm':'Repeat New Password','us.update':'Update Password',
 'act.title':'Activity Log','act.sub':'Last 100 user activities','act.time':'Time','act.user':'User','act.act':'Action','act.detail':'Detail','act.empty':'No activity yet.',
 'm.selDevice':'Select at least one device','m.testing':'Testing connection...','m.okConn':'Connection OK','m.backing':'Backing up configuration...','m.okBackup':'Backup successful','m.runBackup':'Running backup for all devices...','m.doneBackup':'Done: {s} succeeded, {f} failed','m.groupBackup':'Backing up group devices...','m.groupDone':'Group backup done: {s} succeeded, {f} failed','m.status':'Refreshing status...','m.statusDone':'Status refreshed','m.welcome':'Welcome','m.deleted':'deleted','m.saved':'saved','m.added':'added','m.updated':'updated','m.wrongPass':'Current password is wrong','m.mismatch':'New passwords do not match','m.passChanged':'Password changed successfully','m.downloaded':'Backup downloaded','m.uploadOk':'Background uploaded','m.loadErr':'Failed to load','m.defaultGroup':'No description',
},
es:{
 'login.tagline':'COPIA DE SEGURIDAD DE CONFIGURACIÓN','login.title':'Bienvenido de nuevo','login.sub':'Inicie sesión para gestionar las copias de configuración.',
 'login.user':'Usuario','login.pass':'Contraseña','login.submit':'Entrar al Panel','login.bg':'Fondo de inicio de sesión','login.language':'Idioma',
 'common.cancel':'Cancelar','login.default':'Por defecto:','login.change':'cambie la contraseña después de iniciar sesión',
 'nav.menu':'MENÚ PRINCIPAL','nav.dashboard':'Panel','nav.devices':'Dispositivos','nav.groups':'Grupos','nav.backups':'Copias','nav.settings':'Ajustes','nav.users':'Usuarios','nav.activity':'Registro','nav.online':'Sistema en línea','nav.about':'Acerca de','title.about':'Acerca de','sub.about':'Sobre la app y créditos','about.quoteLabel':'Cita del autor',
 'top.refresh':'Actualizar estado','top.pass':'Cambiar Contraseña','top.logout':'Cerrar sesión',
 'title.dashboard':'Panel','sub.dashboard':'Resumen del sistema y dispositivos','title.devices':'Dispositivos','sub.devices':'Gestionar dispositivos y conexiones',
 'title.groups':'Grupos','sub.groups':'Grupos de dispositivos para copias','title.backups':'Copias','sub.backups':'Archivo de configuraciones',
 'title.settings':'Ajustes','sub.settings':'Almacenamiento, automatización y apariencia','title.users':'Usuarios','sub.users':'Gestionar usuarios',
 'title.activity':'Registro de Actividad','sub.activity':'Historial de actividades',
 'dash.hero':'Bienvenido a Savcon Manager','dash.heroText':'Copie la configuración de MikroTik (RouterOS v6/v7), Cisco, Dell FTOS y Alcatel en un solo lugar. Programe con cron y envíe a local, correo, Google Drive o SFTP.',
 'dash.backupAll':'Copiar Todo Ahora','dash.manage':'Gestionar Dispositivos','dash.cron':'Configurar Cron',
 'dash.total':'Total de Dispositivos','dash.online':'Dispositivos en Línea','dash.backups':'Total de Copias','dash.failed':'Copias Fallidas',
 'dash.groups':'grupos','dash.live':'en vivo','dash.files':'archivos','dash.offline':'sin conexión',
 'dash.dist':'Distribución de Dispositivos','dash.distSub':'Por tipo de dispositivo','dash.noDevices':'Aún no hay dispositivos.','dash.recent':'Copias Recientes','dash.recentSub':'Última actividad de copias','dash.viewAll':'Ver todo','dash.noBackups':'Aún no hay copias.',
 'dev.search':'Buscar nombre o IP...','dev.allGroups':'Todos los Grupos','dev.refresh':'Actualizar Estado','dev.backupSel':'Copiar Seleccionados','dev.add':'Añadir Dispositivo',
 'dev.col.device':'Dispositivo','dev.col.group':'Grupo','dev.col.type':'Tipo','dev.col.conn':'Conexión','dev.col.ver':'Versión SO','dev.col.status':'Estado','dev.col.last':'Última Copia','dev.col.act':'Acciones',
 'dev.retention':'retención: {n} archivos','dev.noGroup':'Sin Grupo','dev.empty':'No hay dispositivos. Haga clic en Añadir Dispositivo.',
 'dev.test':'Probar conexión','dev.backup':'Copiar ahora','dev.edit':'Editar','dev.delete':'Eliminar',
 'dev.new':'Añadir Nuevo Dispositivo','dev.editTitle':'Editar Dispositivo','dev.general':'Información General','dev.connSec':'Conexión y Autenticación','dev.storeSec':'Copia y Almacenamiento',
 'dev.name':'Nombre del Dispositivo','dev.group':'Grupo','dev.host':'Host / IP','dev.port':'Puerto','dev.type':'Tipo de Dispositivo','dev.conn':'Método de Acceso','dev.user':'Usuario','dev.pass':'Contraseña','dev.passHint':'deje vacío para mantener la actual',
 'dev.ret':'Retención máx. (1-10)','dev.retHint':'Número de archivos de copia recientes a conservar','dev.store':'Destino de Almacenamiento','dev.sensitive':'Incluir contraseñas sensibles (PPP, etc.)','dev.sensitiveHint':'/export show-sensitive — requiere política sensitive en RouterOS',
 'dev.enabled':'Activar dispositivo para copia automática','dev.notes':'Notas','dev.notesPh':'Información adicional...','dev.save':'Guardar Dispositivo',
 'types.mikrotik':'MikroTik RouterOS','types.cisco':'Cisco IOS','types.dell_ftos':'Dell FTOS','types.alcatel':'Alcatel OS',
 'store.local':'Local','store.email':'Correo','store.gdrive':'Google Drive','store.sftp':'SFTP','store.all':'Todo (Local + Correo + GDrive + SFTP)',
 'grp.title':'Grupos de Dispositivos','grp.sub':'Agrupe dispositivos para copias gestionadas','grp.add':'Añadir Grupo','grp.desc':'Sin descripción','grp.count':'{n} dispositivos','grp.empty':'Aún no hay grupos.','grp.new':'Añadir Grupo','grp.editTitle':'Editar Grupo','grp.name':'Nombre del Grupo','grp.descL':'Descripción',
 'bk.all':'Todos los Dispositivos','bk.backupAll':'Copiar Todo','bk.refresh':'Actualizar','bk.col.device':'Dispositivo','bk.col.file':'Archivo','bk.col.size':'Tamaño','bk.col.store':'Almacenamiento','bk.col.status':'Estado','bk.col.time':'Hora','bk.col.act':'Acciones','bk.empty':'No se encontraron copias.','bk.view':'Ver','bk.download':'Descargar',
 'set.general':'General','set.storage':'Almacenamiento','set.auto':'Automatización (Cron)','set.appearance':'Apariencia',
 'set.appName':'Nombre de la Aplicación','set.tz':'Zona Horaria','set.defaultCreds':'Credenciales por defecto: admin / admin123. Cámbielas en Usuarios → Cambiar Contraseña.',
 'set.about':'Información de Versión','set.ver':'Versión','set.date':'Fecha de Versión','set.author':'Autor',
 'set.smtp':'Correo (SMTP)','set.smtpDesc':'Enviar copias como adjuntos de correo','set.host':'Host','set.port':'Puerto','set.user':'Usuario','set.pass':'Contraseña','set.from':'De','set.to':'Para (separado por comas)','set.tls':'Usar STARTTLS','set.active':'Activo','set.test':'Probar',
 'set.sftp':'SFTP','set.sftpDesc':'Subir copias a un servidor SFTP','set.path':'Ruta Remota',
 'set.gdrive':'Google Drive','set.gdriveDesc':'Subir mediante JSON de Cuenta de Servicio','set.folder':'ID de Carpeta (opcional)','set.creds':'JSON de Cuenta de Servicio','set.credsHint':'Pegue el JSON completo. Comparta la carpeta con el correo de la cuenta de servicio.',
 'set.autoOn':'Copia Automática activada','set.autoOnDesc':'Ejecutar copias según el cron','set.cron':'Expresión Cron','set.cronHint':'Formato: minuto hora día mes día-semana','set.filter':'Filtro de Grupos (opcional)','set.filterHint':'Vacío para todos. Separe los IDs con comas.','set.examples':'Ejemplos de cron:','set.every2':'cada día a las 02:00','set.every15':'cada 15 minutos','set.every820':'a las 08:00 y 20:00','set.weekly':'cada domingo','set.runNow':'Ejecutar Ahora',
 'set.bgTitle':'Fondo de Inicio de Sesión','set.bgDesc':'Elija un degradado o suba su imagen. Aplica a todos los usuarios.','set.opacity':'Opacidad de la Tarjeta','set.opacityHint':'Transparencia de la tarjeta: 0% = transparente, 100% = sólido.','set.preview':'Vista previa','set.save':'Guardar Todos los Ajustes',
 'us.title':'Gestión de Usuarios','us.sub':'Añadir usuarios y cambiar contraseñas','us.mine':'Cambiar Mi Contraseña','us.add':'Añadir Usuario','us.col.user':'Usuario','us.col.role':'Rol','us.col.created':'Creado','us.col.act':'Acciones','us.your':'Su cuenta',
 'us.new':'Añadir Usuario','us.roleUser':'Usuario','us.roleAdmin':'Admin','us.changeTitle':'Cambiar Contraseña','us.old':'Contraseña Actual','us.newp':'Nueva Contraseña','us.confirm':'Repetir Nueva Contraseña','us.update':'Actualizar Contraseña',
 'act.title':'Registro de Actividad','act.sub':'Últimas 100 actividades','act.time':'Hora','act.user':'Usuario','act.act':'Acción','act.detail':'Detalle','act.empty':'Aún no hay actividades.',
 'm.selDevice':'Seleccione al menos un dispositivo','m.testing':'Probando conexión...','m.okConn':'Conexión OK','m.backing':'Copiando configuración...','m.okBackup':'Copia exitosa','m.runBackup':'Copiando todos los dispositivos...','m.doneBackup':'Listo: {s} correctas, {f} fallidas','m.groupBackup':'Copiando dispositivos del grupo...','m.groupDone':'Copia del grupo lista: {s} correctas, {f} fallidas','m.status':'Actualizando estado...','m.statusDone':'Estado actualizado','m.welcome':'Bienvenido','m.deleted':'eliminado','m.saved':'guardado','m.added':'añadido','m.updated':'actualizado','m.wrongPass':'La contraseña actual es incorrecta','m.mismatch':'Las contraseñas nuevas no coinciden','m.passChanged':'Contraseña cambiada','m.downloaded':'Copia descargada','m.uploadOk':'Fondo subido','m.loadErr':'Error al cargar','m.defaultGroup':'Sin descripción',
},
zh:{
 'login.tagline':'网络配置备份管理','login.title':'欢迎回来','login.sub':'登录以管理您的设备配置备份。',
 'login.user':'用户名','login.pass':'密码','login.submit':'登录控制台','login.bg':'登录背景','login.language':'语言',
 'common.cancel':'取消','login.default':'默认：','login.change':'登录后请修改密码',
 'nav.menu':'主菜单','nav.dashboard':'仪表盘','nav.devices':'设备','nav.groups':'分组','nav.backups':'备份','nav.settings':'设置','nav.users':'用户','nav.activity':'活动日志','nav.online':'系统在线','nav.about':'关于','title.about':'关于','sub.about':'关于应用与致谢','about.quoteLabel':'作者寄语',
 'top.refresh':'刷新设备状态','top.pass':'修改密码','top.logout':'退出登录',
 'title.dashboard':'仪表盘','sub.dashboard':'系统与设备概览','title.devices':'设备','sub.devices':'管理设备与备份连接','title.groups':'分组','sub.groups':'用于分组备份的设备组','title.backups':'备份','sub.backups':'设备配置归档',
 'title.settings':'设置','sub.settings':'存储、自动化与外观','title.users':'用户','sub.users':'管理应用用户','title.activity':'活动日志','sub.activity':'用户活动历史',
 'dash.hero':'欢迎使用 Savcon Manager','dash.heroText':'在一个地方备份 MikroTik（RouterOS v6/v7）、Cisco、Dell FTOS 和 Alcatel 配置。通过 cron 定时，发送到本地、邮件、Google Drive 或 SFTP。',
 'dash.backupAll':'立即全部备份','dash.manage':'管理设备','dash.cron':'设置定时任务',
 'dash.total':'设备总数','dash.online':'在线设备','dash.backups':'备份总数','dash.failed':'失败备份',
 'dash.groups':'个分组','dash.live':'实时','dash.files':'个文件','dash.offline':'离线',
 'dash.dist':'设备分布','dash.distSub':'按设备类型','dash.noDevices':'暂无设备。','dash.recent':'最近备份','dash.recentSub':'最近的备份活动','dash.viewAll':'查看全部','dash.noBackups':'暂无备份。',
 'dev.search':'搜索名称或 IP...','dev.allGroups':'所有分组','dev.refresh':'刷新状态','dev.backupSel':'备份选中项','dev.add':'添加设备',
 'dev.col.device':'设备','dev.col.group':'分组','dev.col.type':'类型','dev.col.conn':'连接','dev.col.ver':'系统版本','dev.col.status':'状态','dev.col.last':'上次备份','dev.col.act':'操作',
 'dev.retention':'保留：{n} 个文件','dev.noGroup':'无分组','dev.empty':'暂无设备，请点击添加设备。',
 'dev.test':'测试连接','dev.backup':'立即备份','dev.edit':'编辑','dev.delete':'删除',
 'dev.new':'添加新设备','dev.editTitle':'编辑设备','dev.general':'基本信息','dev.connSec':'连接与认证','dev.storeSec':'备份与存储',
 'dev.name':'设备名称','dev.group':'分组','dev.host':'主机 / IP','dev.port':'端口','dev.type':'设备类型','dev.conn':'访问方式','dev.user':'用户名','dev.pass':'密码','dev.passHint':'留空表示不修改',
 'dev.ret':'最大保留数（1-10）','dev.retHint':'保留的最近备份文件数量','dev.store':'存储目标','dev.sensitive':'包含敏感密码（PPP 等）','dev.sensitiveHint':'/export show-sensitive — 需要 RouterOS 的 sensitive 权限',
 'dev.enabled':'启用自动备份','dev.notes':'备注','dev.notesPh':'附加信息...','dev.save':'保存设备',
 'types.mikrotik':'MikroTik RouterOS','types.cisco':'Cisco IOS','types.dell_ftos':'Dell FTOS','types.alcatel':'Alcatel OS',
 'store.local':'本地','store.email':'邮件','store.gdrive':'Google Drive','store.sftp':'SFTP','store.all':'全部（本地+邮件+GDrive+SFTP）',
 'grp.title':'设备分组','grp.sub':'将设备分组以便管理备份','grp.add':'添加分组','grp.desc':'无描述','grp.count':'{n} 台设备','grp.empty':'暂无分组。','grp.new':'添加分组','grp.editTitle':'编辑分组','grp.name':'分组名称','grp.descL':'描述',
 'bk.all':'所有设备','bk.backupAll':'全部备份','bk.refresh':'刷新','bk.col.device':'设备','bk.col.file':'文件名','bk.col.size':'大小','bk.col.store':'存储','bk.col.status':'状态','bk.col.time':'时间','bk.col.act':'操作','bk.empty':'未找到备份。','bk.view':'查看','bk.download':'下载',
 'set.general':'常规','set.storage':'存储','set.auto':'自动化（Cron）','set.appearance':'外观',
 'set.appName':'应用名称','set.tz':'时区','set.defaultCreds':'默认凭据：admin / admin123。请在用户菜单中尽快修改。',
 'set.about':'版本信息','set.ver':'版本','set.date':'发布日期','set.author':'作者',
 'set.smtp':'邮件（SMTP）','set.smtpDesc':'将备份作为邮件附件发送','set.host':'主机','set.port':'端口','set.user':'用户名','set.pass':'密码 / 应用密码','set.from':'发件人','set.to':'收件人（逗号分隔）','set.tls':'使用 STARTTLS','set.active':'启用','set.test':'测试',
 'set.sftp':'SFTP','set.sftpDesc':'上传备份到 SFTP 服务器','set.path':'远程路径',
 'set.gdrive':'Google Drive','set.gdriveDesc':'通过服务帐号 JSON 上传','set.folder':'文件夹 ID（可选）','set.creds':'服务帐号 JSON','set.credsHint':'粘贴完整的服务帐号 JSON，并将 Drive 文件夹共享给该服务帐号邮箱。',
 'set.autoOn':'启用自动备份','set.autoOnDesc':'按 cron 计划自动备份','set.cron':'Cron 表达式','set.cronHint':'格式：分 时 日 月 星期','set.filter':'分组过滤（可选）','set.filterHint':'留空表示所有设备，多个 ID 用逗号分隔。','set.examples':'Cron 示例：','set.every2':'每天 02:00','set.every15':'每 15 分钟','set.every820':'08:00 和 20:00','set.weekly':'每周日','set.runNow':'立即执行',
 'set.bgTitle':'登录页背景','set.bgDesc':'选择现代渐变或上传自己的图片，所有用户立即生效。','set.opacity':'登录卡片透明度','set.opacityHint':'设置透明度：0% = 全透明，100% = 完全不透明。','set.preview':'卡片预览','set.save':'保存所有设置',
 'us.title':'用户管理','us.sub':'添加用户与修改密码','us.mine':'修改我的密码','us.add':'添加用户','us.col.user':'用户名','us.col.role':'角色','us.col.created':'创建时间','us.col.act':'操作','us.your':'您的账号',
 'us.new':'添加用户','us.roleUser':'用户','us.roleAdmin':'管理员','us.changeTitle':'修改密码','us.old':'当前密码','us.newp':'新密码','us.confirm':'确认新密码','us.update':'更新密码',
 'act.title':'活动日志','act.sub':'最近 100 条用户活动','act.time':'时间','act.user':'用户','act.act':'操作','act.detail':'详情','act.empty':'暂无活动。',
 'm.selDevice':'请至少选择一个设备','m.testing':'正在测试连接...','m.okConn':'连接正常','m.backing':'正在备份配置...','m.okBackup':'备份成功','m.runBackup':'正在备份所有设备...','m.doneBackup':'完成：{s} 成功，{f} 失败','m.groupBackup':'正在备份分组设备...','m.groupDone':'分组备份完成：{s} 成功，{f} 失败','m.status':'正在刷新状态...','m.statusDone':'状态已刷新','m.welcome':'欢迎','m.deleted':'已删除','m.saved':'已保存','m.added':'已添加','m.updated':'已更新','m.wrongPass':'当前密码错误','m.mismatch':'两次新密码不一致','m.passChanged':'密码修改成功','m.downloaded':'备份已下载','m.uploadOk':'背景已上传','m.loadErr':'加载失败','m.defaultGroup':'无描述',
},
pt:{
 'login.tagline':'BACKUP DE CONFIGURAÇÃO DE REDE','login.title':'Bem-vindo de volta','login.sub':'Entre para gerenciar os backups de configuração dos dispositivos.',
 'login.user':'Usuário','login.pass':'Senha','login.submit':'Entrar no Painel','login.bg':'Fundo de login','login.language':'Idioma',
 'common.cancel':'Cancelar','login.default':'Padrão:','login.change':'altere a senha após o login',
 'nav.menu':'MENU PRINCIPAL','nav.dashboard':'Painel','nav.devices':'Dispositivos','nav.groups':'Grupos','nav.backups':'Backups','nav.settings':'Configurações','nav.users':'Usuários','nav.activity':'Registro','nav.online':'Sistema Online','nav.about':'Sobre','title.about':'Sobre','sub.about':'Sobre o app e créditos','about.quoteLabel':'Frase do autor',
 'top.refresh':'Atualizar status','top.pass':'Alterar Senha','top.logout':'Sair',
 'title.dashboard':'Painel','sub.dashboard':'Visão geral do sistema e dispositivos','title.devices':'Dispositivos','sub.devices':'Gerenciar dispositivos e conexões',
 'title.groups':'Grupos','sub.groups':'Grupos de dispositivos para backups','title.backups':'Backups','sub.backups':'Arquivo de configurações',
 'title.settings':'Configurações','sub.settings':'Armazenamento, automação e aparência','title.users':'Usuários','sub.users':'Gerenciar usuários',
 'title.activity':'Registro de Atividade','sub.activity':'Histórico de atividades',
 'dash.hero':'Bem-vindo ao Savcon Manager','dash.heroText':'Faça backup de MikroTik (RouterOS v6/v7), Cisco, Dell FTOS e Alcatel em um só lugar. Agende com cron e envie para local, e-mail, Google Drive ou SFTP.',
 'dash.backupAll':'Backup Tudo Agora','dash.manage':'Gerenciar Dispositivos','dash.cron':'Configurar Cron',
 'dash.total':'Total de Dispositivos','dash.online':'Dispositivos Online','dash.backups':'Total de Backups','dash.failed':'Backups Falhados',
 'dash.groups':'grupos','dash.live':'ao vivo','dash.files':'arquivos','dash.offline':'offline',
 'dash.dist':'Distribuição de Dispositivos','dash.distSub':'Por tipo de dispositivo','dash.noDevices':'Nenhum dispositivo ainda.','dash.recent':'Backups Recentes','dash.recentSub':'Última atividade de backup','dash.viewAll':'Ver todos','dash.noBackups':'Nenhum backup ainda.',
 'dev.search':'Buscar nome ou IP...','dev.allGroups':'Todos os Grupos','dev.refresh':'Atualizar Status','dev.backupSel':'Backup Selecionados','dev.add':'Adicionar Dispositivo',
 'dev.col.device':'Dispositivo','dev.col.group':'Grupo','dev.col.type':'Tipo','dev.col.conn':'Conexão','dev.col.ver':'Versão SO','dev.col.status':'Status','dev.col.last':'Último Backup','dev.col.act':'Ações',
 'dev.retention':'retenção: {n} arquivos','dev.noGroup':'Sem Grupo','dev.empty':'Nenhum dispositivo. Clique em Adicionar Dispositivo.',
 'dev.test':'Testar conexão','dev.backup':'Backup agora','dev.edit':'Editar','dev.delete':'Excluir',
 'dev.new':'Adicionar Novo Dispositivo','dev.editTitle':'Editar Dispositivo','dev.general':'Informações Gerais','dev.connSec':'Conexão e Autenticação','dev.storeSec':'Backup e Armazenamento',
 'dev.name':'Nome do Dispositivo','dev.group':'Grupo','dev.host':'Host / IP','dev.port':'Porta','dev.type':'Tipo de Dispositivo','dev.conn':'Método de Acesso','dev.user':'Usuário','dev.pass':'Senha','dev.passHint':'deixe vazio para manter a atual',
 'dev.ret':'Retenção máx. (1-10)','dev.retHint':'Quantidade de arquivos de backup recentes a manter','dev.store':'Destino de Armazenamento','dev.sensitive':'Incluir senhas sensíveis (PPP, etc.)','dev.sensitiveHint':'/export show-sensitive — requer política sensitive no RouterOS',
 'dev.enabled':'Ativar dispositivo para backup automático','dev.notes':'Notas','dev.notesPh':'Informações adicionais...','dev.save':'Salvar Dispositivo',
 'types.mikrotik':'MikroTik RouterOS','types.cisco':'Cisco IOS','types.dell_ftos':'Dell FTOS','types.alcatel':'Alcatel OS',
 'store.local':'Local','store.email':'E-mail','store.gdrive':'Google Drive','store.sftp':'SFTP','store.all':'Tudo (Local + E-mail + GDrive + SFTP)',
 'grp.title':'Grupos de Dispositivos','grp.sub':'Agrupe dispositivos para backups gerenciados','grp.add':'Adicionar Grupo','grp.desc':'Sem descrição','grp.count':'{n} dispositivos','grp.empty':'Nenhum grupo ainda.','grp.new':'Adicionar Grupo','grp.editTitle':'Editar Grupo','grp.name':'Nome do Grupo','grp.descL':'Descrição',
 'bk.all':'Todos os Dispositivos','bk.backupAll':'Backup Tudo','bk.refresh':'Atualizar','bk.col.device':'Dispositivo','bk.col.file':'Arquivo','bk.col.size':'Tamanho','bk.col.store':'Armazenamento','bk.col.status':'Status','bk.col.time':'Hora','bk.col.act':'Ações','bk.empty':'Nenhum backup encontrado.','bk.view':'Ver','bk.download':'Baixar',
 'set.general':'Geral','set.storage':'Armazenamento','set.auto':'Automação (Cron)','set.appearance':'Aparência',
 'set.appName':'Nome da Aplicação','set.tz':'Fuso Horário','set.defaultCreds':'Credenciais padrão: admin / admin123. Altere em Usuários → Alterar Senha.',
 'set.about':'Informações da Versão','set.ver':'Versão','set.date':'Data da Versão','set.author':'Autor',
 'set.smtp':'E-mail (SMTP)','set.smtpDesc':'Enviar backups como anexos de e-mail','set.host':'Host','set.port':'Porta','set.user':'Usuário','set.pass':'Senha / App Password','set.from':'De','set.to':'Para (separado por vírgulas)','set.tls':'Usar STARTTLS','set.active':'Ativo','set.test':'Testar',
 'set.sftp':'SFTP','set.sftpDesc':'Enviar backups para um servidor SFTP','set.path':'Caminho Remoto',
 'set.gdrive':'Google Drive','set.gdriveDesc':'Enviar via JSON de Conta de Serviço','set.folder':'ID da Pasta (opcional)','set.creds':'JSON da Conta de Serviço','set.credsHint':'Cole o JSON completo. Compartilhe a pasta do Drive com o e-mail da conta de serviço.',
 'set.autoOn':'Backup Automático ativo','set.autoOnDesc':'Executar backups automáticos conforme o cron','set.cron':'Expressão Cron','set.cronHint':'Formato: minuto hora dia mês dia-semana','set.filter':'Filtro de Grupos (opcional)','set.filterHint':'Vazio para todos. Separe os IDs com vírgulas.','set.examples':'Exemplos de cron:','set.every2':'todos os dias às 02:00','set.every15':'a cada 15 minutos','set.every820':'às 08:00 e 20:00','set.weekly':'todo domingo','set.runNow':'Executar Agora',
 'set.bgTitle':'Fundo da Tela de Login','set.bgDesc':'Escolha um gradiente moderno ou envie sua imagem. Aplica-se a todos os usuários.','set.opacity':'Opacidade do Cartão de Login','set.opacityHint':'Transparência do cartão: 0% = transparente, 100% = sólido.','set.preview':'Pré-visualização','set.save':'Salvar Todas as Configurações',
 'us.title':'Gerenciamento de Usuários','us.sub':'Adicionar usuários e alterar senhas','us.mine':'Alterar Minha Senha','us.add':'Adicionar Usuário','us.col.user':'Usuário','us.col.role':'Função','us.col.created':'Criado','us.col.act':'Ações','us.your':'Sua conta',
 'us.new':'Adicionar Usuário','us.roleUser':'Usuário','us.roleAdmin':'Admin','us.changeTitle':'Alterar Senha','us.old':'Senha Atual','us.newp':'Nova Senha','us.confirm':'Repetir Nova Senha','us.update':'Atualizar Senha',
 'act.title':'Registro de Atividade','act.sub':'Últimas 100 atividades','act.time':'Hora','act.user':'Usuário','act.act':'Ação','act.detail':'Detalhe','act.empty':'Nenhuma atividade ainda.',
 'm.selDevice':'Selecione pelo menos um dispositivo','m.testing':'Testando conexão...','m.okConn':'Conexão OK','m.backing':'Fazendo backup...','m.okBackup':'Backup concluído','m.runBackup':'Fazendo backup de todos os dispositivos...','m.doneBackup':'Concluído: {s} com sucesso, {f} falhas','m.groupBackup':'Fazendo backup do grupo...','m.groupDone':'Backup do grupo: {s} com sucesso, {f} falhas','m.status':'Atualizando status...','m.statusDone':'Status atualizado','m.welcome':'Bem-vindo','m.deleted':'excluído','m.saved':'salvo','m.added':'adicionado','m.updated':'atualizado','m.wrongPass':'A senha atual está incorreta','m.mismatch':'As novas senhas não coincidem','m.passChanged':'Senha alterada com sucesso','m.downloaded':'Backup baixado','m.uploadOk':'Fundo enviado','m.loadErr':'Falha ao carregar','m.defaultGroup':'Sem descrição',
},
};

function t(key, vars) {
  let s = (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || I18N.id[key] || key;
  if (vars) Object.keys(vars).forEach(k => { s = s.split('{'+k+'}').join(vars[k]); });
  return s;
}

/* ---------------- icons ---------------- */
const P = {
  dashboard:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  server:'<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><line x1="6" y1="7" x2="6.01" y2="7"/><line x1="6" y1="17" x2="6.01" y2="17"/>',
  layers:'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  archive:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  activity:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  edit:'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  trash:'<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  play:'<polygon points="5 3 19 12 5 21 5 3"/>',
  refresh:'<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>',
  check:'<polyline points="20 6 9 17 4 12"/>',
  x:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  search:'<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  menu:'<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  key:'<circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  cloud:'<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
  mail:'<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  plug:'<path d="M12 22v-5"/><path d="M9 8V2M15 8V2"/><path d="M18 8v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8z"/>',
  lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  bolt:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  globe:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/>',
  info:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
};
function icon(n, s = 18) {
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${P[n] || P.dashboard}</svg>`;
}

/* ---------------- helpers ---------------- */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtSize = (b) => b < 1024 ? (b||0)+' B' : b < 1048576 ? (b/1024).toFixed(1)+' KB' : (b/1048576).toFixed(2)+' MB';
const fmtDate = (s) => s ? new Date(s.replace(' ','T')).toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '-';
const typeLabel = (x) => t('types.' + x) === 'types.' + x ? x : t('types.' + x);
const verLabel = (d) => d.device_type === 'mikrotik' ? `RouterOS v${d.version || '?'}` : (d.version || 'Unknown');

async function api(path, opts = {}, noRedirect = false) {
  opts.headers = Object.assign({}, opts.headers || {}, {'Content-Type':'application/json'});
  if (state.token) opts.headers['Authorization'] = 'Bearer ' + state.token;
  const res = await fetch(API + path, opts);
  const ct = res.headers.get('content-type') || '';
  let data;
  try { data = ct.includes('application/json') ? await res.json() : await res.text(); }
  catch { data = {detail: res.statusText}; }
  if (!res.ok) {
    if (res.status === 401 && !noRedirect) logout();
    throw new Error(data.detail || 'Request failed');
  }
  return data;
}

function toast(msg, type = 'ok') {
  const el = document.createElement('div');
  el.className = 'toast ' + (type === 'err' ? 'err' : 'ok');
  el.innerHTML = `${icon(type === 'err' ? 'x' : 'check', 16)}<span>${esc(msg)}</span>`;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => { el.style.opacity='0'; el.style.transform='translateX(30px)'; el.style.transition='.25s'; setTimeout(()=>el.remove(),260); }, 3600);
}
function openModal(html, wide = false) {
  document.getElementById('modal-root').innerHTML =
    `<div class="modal-overlay open" data-act="overlay-close"><div class="modal ${wide?'wide':''}">${html}</div></div>`;
}
function closeModal() { document.getElementById('modal-root').innerHTML = ''; }
function langOptions(sel) {
  return LANGS.map(([v,n]) => `<option value="${v}" ${sel===v?'selected':''}>${n}</option>`).join('');
}
function setLang(v) {
  state.lang = v; localStorage.setItem('savcon_lang_v2', v);
  if (state.user) { renderApp(); } else { renderLogin(); }
}

/* ---------------- boot / login ---------------- */
async function boot() {
  if (!state.token) return renderLogin();
  try { state.user = await api('/auth/me'); await loadSettings(); renderApp(); }
  catch (e) { logout(); }
}
function logout() { state.token=''; state.user=null; localStorage.removeItem('savcon_token'); renderLogin(); }
async function loadSettings() {
  try { state.settings = await api('/settings'); state.bg = state.settings.login_background || 'aurora'; }
  catch { state.settings = {}; }
}
const BGS = {
  aurora:'linear-gradient(135deg,#312e81,#6b21a8 60%,#0ea5e9)',
  sunset:'linear-gradient(135deg,#7c2d5a,#b45309 70%,#fb7185)',
  ocean:'linear-gradient(135deg,#0e7490,#1e3a8a 70%,#22d3ee)',
  forest:'linear-gradient(135deg,#065f46,#1e3a5f 70%,#34d399)',
  neon:'linear-gradient(135deg,#6d28d9,#0891b2 70%,#db2777)',
  midnight:'linear-gradient(135deg,#1e293b,#020617 70%,#334155)',
};
function applyLoginBg() {
  // Only the login page uses the login-page body class.
  const body = document.body; body.className = 'login-page';
  document.querySelectorAll('.login-photo').forEach(e => e.remove());
  const v = state.bg || 'aurora';
  if (v.startsWith('/') || v.startsWith('http')) {
    const photo = document.createElement('div'); photo.className='login-photo';
    photo.style.backgroundImage = `url('${v}')`; body.prepend(photo);
  } else { body.classList.add('bg-' + v.replace(/[^a-z]/gi,'')); }
}
function applyBgPreview() {
  const el = document.getElementById('bg-preview'); if (!el) return;
  const v = state.bg || 'aurora';
  el.style.background = (v.startsWith('/') || v.startsWith('http'))
    ? `url('${v}') center/cover no-repeat`
    : (BGS[v] || BGS.aurora);
}
async function renderLogin() {
  try { const r = await fetch(API+'/public/background', {cache:'no-store'}); const d = await r.json(); state.bg = d.background || 'aurora'; state.loginOpacity = d.opacity !== undefined ? Number(d.opacity) : 72; } catch {}
  document.documentElement.style.setProperty('--login-opacity', String((Number(state.loginOpacity) || 0) / 100));
  document.getElementById('app').innerHTML = `
  <div class="login-wrap">
    <div class="login-brand"><div class="logo">${icon('shield',24)}</div><div><h1>Savcon Manager</h1><p>${t('login.tagline')}</p></div></div>
    <div class="login-card">
      <h2>${t('login.title')}</h2><p class="sub">${t('login.sub')}</p>
      <div id="login-error" class="login-error"></div>
      <form data-form="login" id="login-form">
        <div class="field"><label>${t('login.user')}</label><div class="input-wrap">${icon('user',16)}<input name="username" class="with-icon" placeholder="admin" autocomplete="username" required></div></div>
        <div class="field"><label>${t('login.pass')}</label><div class="input-wrap">${icon('lock',16)}<input name="password" type="password" class="with-icon" placeholder="••••••••" autocomplete="current-password" required></div></div>
        <button class="btn btn-primary btn-block" type="submit">${icon('logout',17)} ${t('login.submit')}</button>
      </form>
    </div>
  </div>`;
  applyLoginBg();
}
async function doLogin(form) {
  const fd = new FormData(form), err = document.getElementById('login-error');
  err.style.display='none'; const btn=form.querySelector('button[type=submit]'); btn.disabled=true;
  try {
    const d = await api('/auth/login',{method:'POST',body:JSON.stringify({username:fd.get('username'),password:fd.get('password')})},true);
    state.token=d.token; state.user=d.user; localStorage.setItem('savcon_token',d.token);
    // always land on Dashboard, even if a submenu hash was left from the previous session
    history.replaceState(null,'','#/dashboard');
    await loadSettings(); renderApp(); toast(t('m.welcome')+', '+d.user.username);
  } catch (e) { err.textContent=e.message; err.style.display='block'; btn.disabled=false; }
}
async function setBg(value) {
  state.bg=value;
  if (!state.user) applyLoginBg();   // never apply login CSS while inside the app
  applyBgPreview();
  document.querySelectorAll('.bg-dot').forEach(e=>e.classList.toggle('active',e.dataset.bg===value));
  try { await api('/settings/background',{method:'PUT',body:JSON.stringify({value})}); } catch(e) { toast(e.message,'err'); }
}

/* ---------------- app shell ---------------- */
const NAV = [
  ['dashboard','nav.dashboard','dashboard'],['devices','nav.devices','server'],['groups','nav.groups','layers'],
  ['backups','nav.backups','archive'],['settings','nav.settings','settings'],['users','nav.users','users',true],['activity','nav.activity','activity'],['about','nav.about','info'],
];
function renderApp() {
  document.body.className='';
  // remove the login-page background layer left over from the login screen
  document.querySelectorAll('.login-photo').forEach(e => e.remove());
  const nav = NAV.filter(x=>!x[3]||state.user.role==='admin').map(x=>
    `<a href="#/${x[0]}" data-page="${x[0]}" class="${state.page===x[0]?'active':''}">${icon(x[2],18)} ${t(x[1])}</a>`).join('');
  document.getElementById('app').innerHTML = `
  <div class="app">
    <aside class="sidebar" id="sidebar">
      <div class="brand"><div class="logo">${icon('shield',21)}</div><div class="brand-text">Savcon Manager<small>Config Backup</small></div></div>
      <div class="nav-label">${t('nav.menu')}</div><nav class="nav">${nav}</nav>
      <div class="sidebar-foot"><div class="server"><span class="pulse"></span> ${t('nav.online')}</div></div>
    </aside>
    <div class="main">
      <header class="topbar">
        <button class="hamburger" data-act="toggle-sidebar">${icon('menu',21)}</button>
        <div class="page-title" id="page-title"></div>
        <select id="lang-select" class="lang-select top" title="${t('login.language')}">${langOptions(state.lang)}</select>
        <button class="icon-btn" data-act="refresh-status" title="${t('top.refresh')}">${icon('refresh',17)}</button>
        <div class="user-chip" data-act="user-menu">
          <div class="avatar">${esc(state.user.username[0].toUpperCase())}</div>
          <div><div class="uname">${esc(state.user.username)}</div><div class="role">${esc(state.user.role)}</div></div>
          <div class="dropdown" id="user-dropdown">
            <button data-act="open-password">${icon('key',15)} ${t('top.pass')}</button>
            <button data-act="logout">${icon('logout',15)} ${t('top.logout')}</button>
          </div>
        </div>
      </header>
      <main class="content" id="content"><div class="loading"><span class="spin">◌</span> Memuat...</div></main>
    </div>
  </div>`;
  navigate();
}
async function navigate() {
  const page=(location.hash||'#/dashboard').replace('#/','')||'dashboard'; state.page=page;
  document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active',a.dataset.page===page));
  document.getElementById('page-title').innerHTML = `${t('title.'+page)}<small>${t('sub.'+page)}</small>`;
  await renderPage(page);
}
async function renderPage(page) {
  const c=document.getElementById('content');
  c.innerHTML='<div class="loading"><span class="spin">◌</span> Memuat...</div>';
  try {
    if(page==='dashboard') await pageDashboard(c);
    else if(page==='devices') await pageDevices(c);
    else if(page==='groups') await pageGroups(c);
    else if(page==='backups') await pageBackups(c);
    else if(page==='settings') await pageSettings(c);
    else if(page==='users') await pageUsers(c);
    else if(page==='activity') await pageActivity(c);
    else if(page==='about') await pageAbout(c);
  } catch(e) { c.innerHTML=`<div class="empty">${icon('x',36)}<p>${t('m.loadErr')}: ${esc(e.message)}</p></div>`; }
}

/* ---------------- dashboard ---------------- */
async function pageDashboard(c) {
  const d=await api('/dashboard'); state.dashboard=d;
  const max=Math.max(1,...d.by_type.map(x=>x.c));
  c.innerHTML=`
  <div class="hero"><h2>${t('dash.hero')} 👋</h2><p>${t('dash.heroText')}</p>
    <div class="hero-actions">
      <button class="btn btn-primary" data-act="backup-all">${icon('play',15)} ${t('dash.backupAll')}</button>
      <a href="#/devices" class="btn">${icon('server',15)} ${t('dash.manage')}</a>
      <a href="#/settings" class="btn">${icon('bolt',15)} ${t('dash.cron')}</a>
    </div></div>
  <div class="stats">
    <div class="stat" style="--accent:var(--grad);--ic:#a5b4fc;--ic-bg:rgba(99,102,241,.15)"><div class="stat-top"><div class="stat-icon">${icon('server',20)}</div><span class="stat-trend">${d.groups} ${t('dash.groups')}</span></div><div class="stat-value">${d.devices}</div><div class="stat-label">${t('dash.total')}</div></div>
    <div class="stat" style="--accent:linear-gradient(135deg,#34d399,#10b981);--ic:#6ee7b7;--ic-bg:rgba(52,211,153,.15)"><div class="stat-top"><div class="stat-icon">${icon('activity',20)}</div><span class="stat-trend">${t('dash.live')}</span></div><div class="stat-value">${d.online}</div><div class="stat-label">${t('dash.online')}</div></div>
    <div class="stat" style="--accent:var(--grad2);--ic:#67e8f9;--ic-bg:rgba(34,211,238,.15)"><div class="stat-top"><div class="stat-icon">${icon('archive',20)}</div><span class="stat-trend">${d.backups} ${t('dash.files')}</span></div><div class="stat-value">${d.backups}</div><div class="stat-label">${t('dash.backups')}</div></div>
    <div class="stat" style="--accent:linear-gradient(135deg,#fbbf24,#f97316);--ic:#fcd34d;--ic-bg:rgba(251,191,36,.15)"><div class="stat-top"><div class="stat-icon">${icon('shield',20)}</div><span class="stat-trend ${d.failed?'down':''}">${d.offline} ${t('dash.offline')}</span></div><div class="stat-value">${d.failed}</div><div class="stat-label">${t('dash.failed')}</div></div>
  </div>
  <div class="grid-2">
    <div class="card"><div class="card-head"><div><h3>${t('dash.dist')}</h3><p>${t('dash.distSub')}</p></div>${icon('layers',18)}</div><div class="card-body">
      ${d.by_type.length?d.by_type.map(x=>`<div class="bar-row"><span class="bl">${esc(typeLabel(x.device_type))}</span><div class="bar-track"><div class="bar-fill" style="width:${x.c/max*100}%"></div></div><span class="bn">${x.c}</span></div>`).join(''):`<div class="empty"><p>${t('dash.noDevices')}</p></div>`}
    </div></div>
    <div class="card"><div class="card-head"><div><h3>${t('dash.recent')}</h3><p>${t('dash.recentSub')}</p></div><a href="#/backups" class="btn btn-sm">${t('dash.viewAll')}</a></div>
      ${d.recent.length?d.recent.map(b=>`<div class="recent-item"><div class="recent-ic">${icon(b.status==='success'?'check':'x',16)}</div><div class="recent-info"><b>${esc(b.device_name)}</b><span>${esc(b.filename)} · ${esc(b.storage)}</span></div><span class="pill ${b.status}">${b.status}</span><span class="time">${fmtDate(b.created_at)}</span></div>`).join(''):`<div class="empty"><p>${t('dash.noBackups')}</p></div>`}
    </div></div>`;
}

/* ---------------- devices ---------------- */
async function pageDevices(c) {
  state.devices=await api('/devices'); state.groups=await api('/groups');
  c.innerHTML=`
  <div class="toolbar">
    <div class="search">${icon('search',16)}<input id="dev-search" class="with-icon" placeholder="${t('dev.search')}" value="${esc(state.search)}"></div>
    <select id="dev-group"><option value="">${t('dev.allGroups')}</option>${state.groups.map(g=>`<option value="${g.id}" ${state.filterGroup==g.id?'selected':''}>${esc(g.name)}</option>`).join('')}</select>
    <div class="spacer"></div>
    <button class="btn" data-act="refresh-status">${icon('refresh',15)} ${t('dev.refresh')}</button>
    <button class="btn" data-act="backup-selected">${icon('play',15)} ${t('dev.backupSel')}</button>
    <button class="btn btn-primary" data-act="add-device">${icon('plus',15)} ${t('dev.add')}</button>
  </div>
  <div class="card"><div class="table-wrap"><table>
    <thead><tr><th style="width:36px"><input type="checkbox" id="check-all"></th><th>${t('dev.col.device')}</th><th>${t('dev.col.group')}</th><th>${t('dev.col.type')}</th><th>${t('dev.col.conn')}</th><th>${t('dev.col.ver')}</th><th>${t('dev.col.status')}</th><th>${t('dev.col.last')}</th><th>${t('dev.col.act')}</th></tr></thead>
    <tbody id="device-tbody">${deviceRows()}</tbody>
  </table></div></div>`;
}
function filteredDevices() {
  return state.devices.filter(d=>{
    if(state.filterGroup&&String(d.group_id)!==String(state.filterGroup)) return false;
    if(state.search&&!(d.name+' '+d.host).toLowerCase().includes(state.search.toLowerCase())) return false;
    return true;
  });
}
function deviceRows() {
  const list=filteredDevices();
  if(!list.length) return `<tr><td colspan="9"><div class="empty">${icon('server',36)}<p>${t('dev.empty')}</p></div></td></tr>`;
  return list.map(d=>`<tr>
    <td><input type="checkbox" name="deviceCheck" value="${d.id}"></td>
    <td><div class="cell-main">${esc(d.name)}</div><div class="cell-sub mono">${esc(d.host)}:${d.port}</div></td>
    <td>${d.group_name?`<span class="pill info">${esc(d.group_name)}</span>`:`<span class="cell-sub">${t('dev.noGroup')}</span>`}</td>
    <td>${esc(typeLabel(d.device_type))}</td>
    <td><span class="pill cyan">${esc(d.connection.toUpperCase())}</span></td>
    <td class="mono">${esc(verLabel(d))}</td>
    <td><span class="pill ${d.status}"><span class="dot-sm"></span>${esc(d.status)}</span></td>
    <td><div class="cell-sub">${fmtDate(d.last_backup_at)}</div><div class="cell-sub">${t('dev.retention',{n:d.retention})}</div></td>
    <td><div class="row-actions">
      <button class="icon-act" data-act="test-device" data-id="${d.id}" title="${t('dev.test')}">${icon('plug',15)}</button>
      <button class="icon-act" data-act="backup-device" data-id="${d.id}" title="${t('dev.backup')}">${icon('play',15)}</button>
      <button class="icon-act" data-act="edit-device" data-id="${d.id}" title="${t('dev.edit')}">${icon('edit',15)}</button>
      <button class="icon-act danger" data-act="delete-device" data-id="${d.id}" title="${t('dev.delete')}">${icon('trash',15)}</button>
    </div></td></tr>`).join('');
}
function deviceModal(dev) {
  state.modalCtx={deviceId:dev?.id||null};
  const sensitive = dev ? dev.export_sensitive!==0 : true;
  openModal(`
  <div class="modal-head"><h3>${dev?t('dev.editTitle'):t('dev.new')}</h3><button class="icon-btn" data-act="close-modal">${icon('x',17)}</button></div>
  <form data-form="device" id="device-form"><div class="modal-body">
    <div class="form-section-title">${t('dev.general')}</div><div class="form-grid">
      <div class="field"><label>${t('dev.name')} *</label><input name="name" value="${esc(dev?.name||'')}" required placeholder="RTR-CORE-01"></div>
      <div class="field"><label>${t('dev.group')}</label><select name="group_id"><option value="">${t('dev.noGroup')}</option>${state.groups.map(g=>`<option value="${g.id}" ${dev?.group_id==g.id?'selected':''}>${esc(g.name)}</option>`).join('')}</select></div>
      <div class="field"><label>${t('dev.host')} *</label><input name="host" value="${esc(dev?.host||'')}" required placeholder="172.20.20.1"></div>
      <div class="field"><label>${t('dev.port')} *</label><input name="port" type="number" value="${dev?.port||22}" required min="1" max="65535"></div>
    </div>
    <div class="form-section-title">${t('dev.connSec')}</div><div class="form-grid">
      <div class="field"><label>${t('dev.type')}</label><select name="device_type">${['mikrotik','cisco','dell_ftos','alcatel'].map(x=>`<option value="${x}" ${dev?.device_type===x?'selected':''}>${typeLabel(x)}</option>`).join('')}</select></div>
      <div class="field"><label>${t('dev.conn')}</label><select name="connection"><option value="ssh" ${dev?.connection==='ssh'?'selected':''}>SSH</option><option value="telnet" ${dev?.connection==='telnet'?'selected':''}>Telnet</option></select></div>
      <div class="field"><label>${t('dev.user')}</label><input name="username" value="${esc(dev?.username||'')}" required></div>
      <div class="field"><label>${t('dev.pass')}</label><input name="password" type="password" value="${esc(dev?.password||'')}"><div class="hint">${t('dev.passHint')}</div></div>
    </div>
    <div class="form-section-title">${t('dev.storeSec')}</div><div class="form-grid">
      <div class="field"><label>${t('dev.ret')}</label><input name="retention" type="number" min="1" max="10" value="${dev?.retention||5}"><div class="hint">${t('dev.retHint')}</div></div>
      <div class="field"><label>${t('dev.store')}</label><select name="storage_mode">${['local','email','gdrive','sftp','all'].map(m=>`<option value="${m}" ${dev?.storage_mode===m?'selected':''}>${t('store.'+m)}</option>`).join('')}</select></div>
      <div class="field full" id="sensitive-field"><label class="checkline"><input type="checkbox" name="export_sensitive" value="1" ${sensitive?'checked':''}> ${t('dev.sensitive')}</label><div class="hint">${t('dev.sensitiveHint')}</div></div>
      <div class="field full"><label class="checkline"><input type="checkbox" name="enabled" value="1" ${dev?.enabled!==0?'checked':''}> ${t('dev.enabled')}</label></div>
      <div class="field full"><label>${t('dev.notes')}</label><textarea name="notes" rows="2" placeholder="${t('dev.notesPh')}">${esc(dev?.notes||'')}</textarea></div>
    </div>
  </div>
  <div class="modal-foot"><button type="button" class="btn" data-act="close-modal">${t('common.cancel')||'Batal'}</button><button type="submit" class="btn btn-primary">${icon('check',15)} ${t('dev.save')}</button></div>
  </form>`,true);
  // this option only applies to RouterOS (export show-sensitive)
  const form = document.getElementById('device-form');
  const typeSel = form.querySelector('[name=device_type]');
  const sensField = document.getElementById('sensitive-field');
  const toggleSensitive = () => { sensField.style.display = typeSel.value === 'mikrotik' ? '' : 'none'; };
  typeSel.addEventListener('change', toggleSensitive);
  toggleSensitive();
}

/* ---------------- groups ---------------- */
async function pageGroups(c) {
  state.groups=await api('/groups');
  c.innerHTML=`
  <div class="toolbar"><div><div class="section-title">${t('grp.title')}</div><div class="section-sub" style="margin:0">${t('grp.sub')}</div></div><div class="spacer"></div><button class="btn btn-primary" data-act="add-group">${icon('plus',15)} ${t('grp.add')}</button></div>
  <div class="group-grid">
    ${state.groups.length?state.groups.map(g=>`<div class="group-card"><h3>${esc(g.name)}</h3><p>${esc(g.description||t('grp.desc'))}</p>
      <div class="gc-foot"><span class="group-count">${icon('server',15)} ${t('grp.count',{n:g.device_count})}</span>
      <div class="row-actions">
        <button class="icon-act" data-act="backup-group" data-id="${g.id}" title="${t('dev.backup')}">${icon('play',15)}</button>
        <button class="icon-act" data-act="edit-group" data-id="${g.id}" title="${t('dev.edit')}">${icon('edit',15)}</button>
        <button class="icon-act danger" data-act="delete-group" data-id="${g.id}" title="${t('dev.delete')}">${icon('trash',15)}</button>
      </div></div></div>`).join(''):`<div class="card"><div class="empty">${icon('layers',36)}<p>${t('grp.empty')}</p></div></div>`}
  </div>`;
}
function groupModal(g) {
  state.modalCtx={groupId:g?.id||null};
  openModal(`
  <div class="modal-head"><h3>${g?t('grp.editTitle'):t('grp.new')}</h3><button class="icon-btn" data-act="close-modal">${icon('x',17)}</button></div>
  <form data-form="group"><div class="modal-body">
    <div class="field"><label>${t('grp.name')} *</label><input name="name" value="${esc(g?.name||'')}" required></div>
    <div class="field"><label>${t('grp.descL')}</label><textarea name="description" rows="3">${esc(g?.description||'')}</textarea></div>
  </div><div class="modal-foot"><button type="button" class="btn" data-act="close-modal">Batal</button><button class="btn btn-primary" type="submit">${icon('check',15)} Simpan</button></div></form>`);
}

/* ---------------- backups ---------------- */
async function pageBackups(c) {
  state.backups=await api('/backups'); state.devices=await api('/devices');
  c.innerHTML=`
  <div class="toolbar"><select id="backup-filter"><option value="">${t('bk.all')}</option>${state.devices.map(d=>`<option value="${d.id}" ${state.backupFilter==d.id?'selected':''}>${esc(d.name)}</option>`).join('')}</select>
    <div class="spacer"></div><button class="btn" data-act="backup-all">${icon('play',15)} ${t('bk.backupAll')}</button><button class="btn" data-act="refresh-backups">${icon('refresh',15)} ${t('bk.refresh')}</button></div>
  <div class="card"><div class="table-wrap"><table>
    <thead><tr><th>${t('bk.col.device')}</th><th>${t('bk.col.file')}</th><th>${t('bk.col.size')}</th><th>${t('bk.col.store')}</th><th>${t('bk.col.status')}</th><th>${t('bk.col.time')}</th><th>${t('bk.col.act')}</th></tr></thead>
    <tbody>${backupRows()}</tbody>
  </table></div></div>`;
}
function backupRows() {
  const list=state.backups.filter(b=>!state.backupFilter||String(b.device_id)===String(state.backupFilter));
  if(!list.length) return `<tr><td colspan="7"><div class="empty">${icon('archive',36)}<p>${t('bk.empty')}</p></div></td></tr>`;
  return list.map(b=>`<tr>
    <td><div class="cell-main">${esc(b.device_name)}</div></td><td class="mono">${esc(b.filename)}</td><td>${fmtSize(b.size)}</td>
    <td><span class="pill info">${esc(b.storage)}</span></td>
    <td><span class="pill ${b.status}">${b.status}</span>${b.message&&b.message!=='local'?`<div class="cell-sub">${esc(b.message)}</div>`:''}</td>
    <td class="cell-sub">${fmtDate(b.created_at)}</td>
    <td><div class="row-actions">
      ${b.status==='success'?`<button class="icon-act" data-act="view-backup" data-id="${b.id}" title="${t('bk.view')}">${icon('eye',15)}</button><button class="icon-act" data-act="download-backup" data-id="${b.id}" title="${t('bk.download')}">${icon('download',15)}</button>`:''}
      <button class="icon-act danger" data-act="delete-backup" data-id="${b.id}" title="${t('dev.delete')}">${icon('trash',15)}</button>
    </div></td></tr>`).join('');
}

/* ---------------- settings ---------------- */
async function pageSettings(c) {
  const s=state.settings||{};
  c.innerHTML=`
  <div class="tabs">
    <button class="tab active" data-act="tab" data-tab="general">${icon('shield',15)} ${t('set.general')}</button>
    <button class="tab" data-act="tab" data-tab="storage">${icon('cloud',15)} ${t('set.storage')}</button>
    <button class="tab" data-act="tab" data-tab="auto">${icon('clock',15)} ${t('set.auto')}</button>
    <button class="tab" data-act="tab" data-tab="appearance">${icon('image',15)} ${t('set.appearance')}</button>
  </div>
  <form data-form="settings" id="settings-form">
  <div class="tab-pane active" id="tab-general">
    <div class="card"><div class="card-body"><div class="form-grid">
      <div class="field"><label>${t('set.appName')}</label><input value="${esc(s.app_name||'Savcon Manager')}" disabled></div>
      <div class="field"><label>${t('set.tz')}</label><input value="Asia/Jakarta" disabled></div>
      <div class="field"><label>${t('login.language')}</label><select id="settings-lang" class="lang-select">${langOptions(state.lang)}</select></div>
    </div><div class="hint" style="margin-top:16px">${t('set.defaultCreds')}</div></div></div>
    <div class="card" style="margin-top:16px"><div class="card-body"><h3 style="font-size:14px;margin-bottom:14px">${t('set.about')}</h3><div class="form-grid">
      <div class="field"><label>${t('set.appName')}</label><input value="${APP.name}" disabled></div>
      <div class="field"><label>${t('set.ver')}</label><input value="v${APP.version}" disabled></div>
      <div class="field"><label>${t('set.date')}</label><input value="${APP.release}" disabled></div>
      <div class="field"><label>${t('set.author')}</label><input value="${APP.author}" disabled></div>
    </div></div></div>
  </div>
  <div class="tab-pane" id="tab-storage">
    <div class="card" style="margin-bottom:16px"><div class="card-head"><div><h3>${icon('mail',15)} ${t('set.smtp')}</h3><p>${t('set.smtpDesc')}</p></div><label class="checkline"><input type="checkbox" name="smtp_enabled" value="1" ${s.smtp_enabled==='1'?'checked':''}> ${t('set.active')}</label></div>
      <div class="card-body"><div class="form-grid">
        <div class="field"><label>${t('set.host')}</label><input name="smtp_host" value="${esc(s.smtp_host||'')}" placeholder="smtp.gmail.com"></div>
        <div class="field"><label>${t('set.port')}</label><input name="smtp_port" value="${esc(s.smtp_port||587)}"></div>
        <div class="field"><label>${t('set.user')}</label><input name="smtp_user" value="${esc(s.smtp_user||'')}"></div>
        <div class="field"><label>${t('set.pass')}</label><input name="smtp_password" type="password" value="${esc(s.smtp_password||'')}"></div>
        <div class="field"><label>${t('set.from')}</label><input name="smtp_from" value="${esc(s.smtp_from||'')}"></div>
        <div class="field"><label>${t('set.to')}</label><input name="smtp_to" value="${esc(s.smtp_to||'')}"></div>
        <div class="field"><label class="checkline"><input type="checkbox" name="smtp_tls" value="1" ${s.smtp_tls==='1'?'checked':''}> ${t('set.tls')}</label></div>
      </div><button type="button" class="btn btn-sm" data-act="test-backend" data-backend="email" style="margin-top:14px">${icon('plug',14)} ${t('set.test')} Email</button></div></div>
    <div class="card" style="margin-bottom:16px"><div class="card-head"><div><h3>${icon('plug',15)} SFTP</h3><p>${t('set.sftpDesc')}</p></div><label class="checkline"><input type="checkbox" name="sftp_enabled" value="1" ${s.sftp_enabled==='1'?'checked':''}> ${t('set.active')}</label></div>
      <div class="card-body"><div class="form-grid">
        <div class="field"><label>${t('set.host')}</label><input name="sftp_host" value="${esc(s.sftp_host||'')}"></div>
        <div class="field"><label>${t('set.port')}</label><input name="sftp_port" value="${esc(s.sftp_port||22)}"></div>
        <div class="field"><label>${t('set.user')}</label><input name="sftp_user" value="${esc(s.sftp_user||'')}"></div>
        <div class="field"><label>${t('set.pass')}</label><input name="sftp_password" type="password" value="${esc(s.sftp_password||'')}"></div>
        <div class="field full"><label>${t('set.path')}</label><input name="sftp_path" value="${esc(s.sftp_path||'/backups')}"></div>
      </div><button type="button" class="btn btn-sm" data-act="test-backend" data-backend="sftp" style="margin-top:14px">${icon('plug',14)} ${t('set.test')} SFTP</button></div></div>
    <div class="card"><div class="card-head"><div><h3>${icon('cloud',15)} Google Drive</h3><p>${t('set.gdriveDesc')}</p></div><label class="checkline"><input type="checkbox" name="gdrive_enabled" value="1" ${s.gdrive_enabled==='1'?'checked':''}> ${t('set.active')}</label></div>
      <div class="card-body"><div class="form-grid">
        <div class="field"><label>${t('set.folder')}</label><input name="gdrive_folder_id" value="${esc(s.gdrive_folder_id||'')}"></div>
        <div class="field full"><label>${t('set.creds')}</label><textarea name="gdrive_credentials" rows="6">${esc(s.gdrive_credentials||'')}</textarea><div class="hint">${t('set.credsHint')}</div></div>
      </div><button type="button" class="btn btn-sm" data-act="test-backend" data-backend="gdrive" style="margin-top:14px">${icon('plug',14)} ${t('set.test')} GDrive</button></div></div>
  </div>
  <div class="tab-pane" id="tab-auto"><div class="card"><div class="card-body">
    <div class="toggle-row"><div class="tl"><b>${t('set.autoOn')}</b><span>${t('set.autoOnDesc')}</span></div><label class="switch"><input type="checkbox" name="auto_enabled" value="1" ${s.auto_enabled==='1'?'checked':''}><span class="slider"></span></label></div>
    <div class="form-grid" style="margin-top:18px">
      <div class="field"><label>${t('set.cron')}</label><input name="auto_cron" value="${esc(s.auto_cron||'0 2 * * *')}"><div class="hint">${t('set.cronHint')}</div></div>
      <div class="field"><label>${t('set.filter')}</label><input name="auto_groups" value="${esc(s.auto_groups||'')}"><div class="hint">${t('set.filterHint')}</div></div>
    </div>
    <div class="card" style="background:rgba(99,102,241,.07);border-color:rgba(99,102,241,.2);margin-top:16px"><div class="card-body" style="padding:16px"><b style="font-size:12.5px">${t('set.examples')}</b>
      <div class="mono" style="font-size:11.5px;color:#a5b4fc;line-height:2;margin-top:8px">
        <div><code>0 2 * * *</code> → ${t('set.every2')}</div><div><code>*/15 * * * *</code> → ${t('set.every15')}</div>
        <div><code>0 8,20 * * *</code> → ${t('set.every820')}</div><div><code>0 0 * * 0</code> → ${t('set.weekly')}</div>
      </div></div></div>
    <button type="button" class="btn btn-cyan" data-act="backup-all" style="margin-top:16px">${icon('play',15)} ${t('set.runNow')}</button>
  </div></div></div>
  <div class="tab-pane" id="tab-appearance"><div class="card"><div class="card-body">
    <h3 style="font-size:14px;margin-bottom:6px">${t('set.bgTitle')}</h3><p class="hint" style="margin-bottom:18px">${t('set.bgDesc')}</p>
    <div class="bg-picker" style="justify-content:flex-start;gap:12px">
      ${Object.entries(BGS).map(([k,g])=>`<button type="button" class="bg-dot ${state.bg===k?'active':''}" data-act="set-bg" data-bg="${k}" style="width:52px;height:52px;border-radius:13px;background:${g}" title="${k}"></button>`).join('')}
      <label class="bg-dot upload" style="width:52px;height:52px;border-radius:13px" title="${t('set.bgTitle')}">${icon('image',20)}<input type="file" id="settings-bg-file" accept="image/*" hidden></label>
    </div>
    <div class="bg-preview" id="bg-preview" title="${t('set.bgTitle')}"></div>
    <div class="field full" style="margin-top:24px">
      <label>${t('set.opacity')} — <span id="opacity-val">${Number(s.login_opacity ?? 72)}%</span></label>
      <input type="range" id="login-opacity" name="login_opacity" min="0" max="100" value="${Number(s.login_opacity ?? 72)}">
      <div class="hint">${t('set.opacityHint')}</div>
      <div class="opacity-preview" id="opacity-preview" style="--pv:${Number(s.login_opacity ?? 72)/100}">
        <b>Savcon Manager</b><p>${t('set.preview')}</p>
      </div>
    </div>
  </div></div></div>
  <div style="position:sticky;bottom:0;padding:16px 0 0;display:flex;justify-content:flex-end"><button type="submit" class="btn btn-primary">${icon('check',15)} ${t('set.save')}</button></div>
  </form>`;
  applyBgPreview();
}

/* ---------------- users / activity ---------------- */
async function pageUsers(c) {
  state.users=await api('/users');
  c.innerHTML=`
  <div class="toolbar"><div><div class="section-title">${t('us.title')}</div><div class="section-sub" style="margin:0">${t('us.sub')}</div></div><div class="spacer"></div>
    <button class="btn" data-act="open-password">${icon('key',15)} ${t('us.mine')}</button>
    ${state.user.role==='admin'?`<button class="btn btn-primary" data-act="add-user">${icon('plus',15)} ${t('us.add')}</button>`:''}</div>
  <div class="card"><div class="table-wrap"><table>
    <thead><tr><th>${t('us.col.user')}</th><th>${t('us.col.role')}</th><th>${t('us.col.created')}</th><th>${t('us.col.act')}</th></tr></thead>
    <tbody>${state.users.map(u=>`<tr><td><div class="cell-main">${esc(u.username)}</div></td><td><span class="pill ${u.role==='admin'?'info':'cyan'}">${esc(u.role)}</span></td>
      <td class="cell-sub">${fmtDate(u.created_at)}</td><td>${u.id!==state.user.id?`<button class="icon-act danger" data-act="delete-user" data-id="${u.id}">${icon('trash',15)}</button>`:`<span class="cell-sub">${t('us.your')}</span>`}</td></tr>`).join('')}</tbody>
  </table></div></div>`;
}
function userModal() {
  openModal(`
  <div class="modal-head"><h3>${t('us.new')}</h3><button class="icon-btn" data-act="close-modal">${icon('x',17)}</button></div>
  <form data-form="user"><div class="modal-body">
    <div class="field"><label>${t('us.col.user')} *</label><input name="username" required></div>
    <div class="field"><label>${t('login.pass')} *</label><input name="password" type="password" minlength="4" required></div>
    <div class="field"><label>${t('us.col.role')}</label><select name="role"><option value="user">${t('us.roleUser')}</option><option value="admin">${t('us.roleAdmin')}</option></select></div>
  </div><div class="modal-foot"><button type="button" class="btn" data-act="close-modal">Batal</button><button class="btn btn-primary" type="submit">${icon('check',15)} Simpan</button></div></form>`);
}
function passwordModal() {
  openModal(`
  <div class="modal-head"><h3>${t('us.changeTitle')}</h3><button class="icon-btn" data-act="close-modal">${icon('x',17)}</button></div>
  <form data-form="password"><div class="modal-body">
    <div class="field"><label>${t('us.old')} *</label><input name="old_password" type="password" required></div>
    <div class="field"><label>${t('us.newp')} *</label><input name="new_password" type="password" minlength="4" required></div>
    <div class="field"><label>${t('us.confirm')} *</label><input name="confirm" type="password" minlength="4" required></div>
  </div><div class="modal-foot"><button type="button" class="btn" data-act="close-modal">Batal</button><button class="btn btn-primary" type="submit">${icon('check',15)} ${t('us.update')}</button></div></form>`);
}
async function pageActivity(c) {
  state.activity=await api('/activity');
  c.innerHTML=`
  <div class="toolbar"><div><div class="section-title">${t('act.title')}</div><div class="section-sub" style="margin:0">${t('act.sub')}</div></div></div>
  <div class="card"><div class="table-wrap"><table class="activity-table">
    <thead><tr><th class="col-time">${t('act.time')}</th><th>${t('act.user')}</th><th>${t('act.act')}</th><th>${t('act.detail')}</th></tr></thead>
    <tbody>${state.activity.length?state.activity.map(a=>`<tr><td class="cell-sub col-time">${fmtDate(a.created_at)}</td><td class="cell-main">${esc(a.username)}</td><td><span class="pill info">${esc(a.action)}</span></td><td class="cell-sub">${esc(a.detail)}</td></tr>`).join(''):`<tr><td colspan="4"><div class="empty">${icon('activity',36)}<p>${t('act.empty')}</p></div></td></tr>`}</tbody>
  </table></div></div>`;
}

/* ---------------- about ---------------- */
async function pageAbout(c) {
  c.innerHTML = `
  <div class="hero" style="margin-bottom:22px">
    <div style="display:flex;align-items:center;gap:16px;position:relative;z-index:2">
      <div class="logo" style="width:58px;height:58px;border-radius:16px;background:var(--grad);display:grid;place-items:center;box-shadow:0 10px 30px rgba(99,102,241,.45);flex:none">${icon('shield',30)}</div>
      <div><h2 style="font-size:24px">${APP.name}</h2><p style="margin-top:6px">${t('sub.about')}</p></div>
    </div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-head"><h3>${t('set.about')}</h3>${icon('info',18)}</div>
      <div class="card-body">
        <div class="about-line"><span>${t('set.ver')}</span><b>Release v${APP.version}</b></div>
        <div class="about-line"><span>${t('set.date')}</span><b>${APP.release}</b></div>
        <div class="about-line"><span>${t('set.author')}</span><b>${APP.author}</b></div>
        <div class="about-line"><span>${t('set.appName')}</span><b>${APP.name}</b></div>
      </div>
    </div>
    <div class="card">
      <div class="card-head"><h3>${t('about.quoteLabel')}</h3>${icon('bolt',18)}</div>
      <div class="card-body">
        <div class="quote-mark">“</div>
        <blockquote class="quote-text">${esc(QUOTE)}</blockquote>
      </div>
    </div>
  </div>`;
}

/* ---------------- events ---------------- */
document.addEventListener('click',async(e)=>{
  const el=e.target.closest('[data-act]'); if(!el) return;
  const act=el.dataset.act,id=Number(el.dataset.id);
  try {
    if(act==='close-modal'){closeModal();return;}
    if(act==='overlay-close'){if(e.target.classList.contains('modal-overlay'))closeModal();return;}
    if(act==='set-bg'){e.preventDefault();await setBg(el.dataset.bg);return;}
    if(act==='toggle-sidebar'){document.getElementById('sidebar').classList.toggle('open');return;}
    if(act==='logout'){logout();return;}
    if(act==='user-menu'){document.getElementById('user-dropdown').classList.toggle('open');return;}
    if(act==='open-password'){document.getElementById('user-dropdown')?.classList.remove('open');passwordModal();return;}
    if(act==='add-device'){deviceModal(null);return;}
    if(act==='edit-device'){deviceModal(state.devices.find(d=>d.id===id));return;}
    if(act==='add-group'){groupModal(null);return;}
    if(act==='edit-group'){groupModal(state.groups.find(g=>g.id===id));return;}
    if(act==='add-user'){userModal();return;}
    if(act==='tab'){document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===el));document.querySelectorAll('.tab-pane').forEach(p=>p.classList.toggle('active',p.id==='tab-'+el.dataset.tab));return;}
    if(el.dataset.page){navigate();return;}
    if(act==='test-device'){toast(t('m.testing'));const r=await api(`/devices/${id}/test`,{method:'POST'});toast(t('m.okConn')+' · '+r.version);navigate();return;}
    if(act==='backup-device'){el.disabled=true;toast(t('m.backing'));const r=await api(`/devices/${id}/backup`,{method:'POST'});toast(t('m.okBackup')+' · '+r.filename+' ('+fmtSize(r.size)+')');navigate();return;}
    if(act==='delete-device'){if(!confirm(t('dev.delete')+'?'))return;await api(`/devices/${id}`,{method:'DELETE'});toast(t('m.deleted'));pageDevices(document.getElementById('content'));return;}
    if(act==='backup-group'){el.disabled=true;toast(t('m.groupBackup'));const r=await api('/backups/run',{method:'POST',body:JSON.stringify({group_id:id})});toast(t('m.groupDone',{s:r.success,f:r.failed}));navigate();return;}
    if(act==='delete-group'){if(!confirm(t('dev.delete')+'?'))return;await api(`/groups/${id}`,{method:'DELETE'});toast(t('m.deleted'));pageGroups(document.getElementById('content'));return;}
    if(act==='delete-user'){if(!confirm(t('dev.delete')+'?'))return;await api(`/users/${id}`,{method:'DELETE'});toast(t('m.deleted'));pageUsers(document.getElementById('content'));return;}
    if(act==='delete-backup'){if(!confirm(t('dev.delete')+'?'))return;await api(`/backups/${id}`,{method:'DELETE'});toast(t('m.deleted'));pageBackups(document.getElementById('content'));return;}
    if(act==='download-backup'){const res=await fetch(`${API}/backups/${id}/download`,{headers:{Authorization:'Bearer '+state.token}});if(!res.ok)throw new Error('Download failed');const blob=await res.blob();const url=URL.createObjectURL(blob);const a=document.createElement('a');const row=state.backups.find(b=>b.id===id);a.href=url;a.download=row?.filename||'backup.txt';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);toast(t('m.downloaded'));return;}
    if(act==='view-backup'){
      const txt=await api(`/backups/${id}/view`); const row=state.backups.find(b=>b.id===id);
      openModal(`<div class="modal-head"><h3>${esc(row?.filename||'Config')}</h3><button class="icon-btn" data-act="close-modal">${icon('x',17)}</button></div><div class="modal-body"><pre class="code">${esc(txt)}</pre></div>`,true);
      return;
    }
    if(act==='refresh-status'){toast(t('m.status'));await api('/devices/refresh-status',{method:'POST'});toast(t('m.statusDone'));navigate();return;}
    if(act==='refresh-backups'){pageBackups(document.getElementById('content'));return;}
    if(act==='backup-all'){el.disabled=true;toast(t('m.runBackup'));const r=await api('/backups/run',{method:'POST',body:JSON.stringify({})});toast(t('m.doneBackup',{s:r.success,f:r.failed}));navigate();return;}
    if(act==='backup-selected'){const ids=[...document.querySelectorAll('input[name=deviceCheck]:checked')].map(x=>Number(x.value));if(!ids.length){toast(t('m.selDevice'),'err');return;}el.disabled=true;const r=await api('/backups/run',{method:'POST',body:JSON.stringify({device_ids:ids})});toast(t('m.doneBackup',{s:r.success,f:r.failed}));navigate();return;}
    if(act==='test-backend'){toast(t('m.testing'));const r=await api(`/settings/test/${el.dataset.backend}`,{method:'POST'});toast(r.result,r.result.includes('ok')?'ok':'err');return;}
  } catch(err){toast(err.message,'err');}
});
document.addEventListener('submit',async(e)=>{
  const form=e.target.closest('[data-form]'); if(!form)return; e.preventDefault();
  const kind=form.dataset.form,fd=new FormData(form),val=k=>fd.get(k),btn=form.querySelector('[type=submit]'); if(btn)btn.disabled=true;
  try {
    if(kind==='login'){await doLogin(form);return;}
    if(kind==='device'){
      const body={name:val('name'),host:val('host'),port:Number(val('port')),device_type:val('device_type'),connection:val('connection'),username:val('username'),password:val('password'),group_id:val('group_id')?Number(val('group_id')):null,retention:Number(val('retention')),storage_mode:val('storage_mode'),enabled:val('enabled')?1:0,export_sensitive:(val('device_type')==='mikrotik'&&val('export_sensitive'))?1:0,notes:val('notes')||''};
      const id=state.modalCtx.deviceId;
      await api(id?`/devices/${id}`:'/devices',{method:id?'PUT':'POST',body:JSON.stringify(body)});
      closeModal();toast(id?t('m.updated'):t('m.added'));pageDevices(document.getElementById('content'));return;
    }
    if(kind==='group'){
      await api(state.modalCtx.groupId?`/groups/${state.modalCtx.groupId}`:'/groups',{method:state.modalCtx.groupId?'PUT':'POST',body:JSON.stringify({name:val('name'),description:val('description')||''})});
      closeModal();toast(t('m.saved'));pageGroups(document.getElementById('content'));return;
    }
    if(kind==='user'){await api('/users',{method:'POST',body:JSON.stringify({username:val('username'),password:val('password'),role:val('role')})});closeModal();toast(t('m.added'));pageUsers(document.getElementById('content'));return;}
    if(kind==='password'){
      if(val('new_password')!==val('confirm')){toast(t('m.mismatch'),'err');return;}
      await api('/auth/change-password',{method:'POST',body:JSON.stringify({old_password:val('old_password'),new_password:val('new_password')})});closeModal();toast(t('m.passChanged'));return;
    }
    if(kind==='settings'){
      const values={};
      ['app_name','login_opacity','smtp_host','smtp_port','smtp_user','smtp_password','smtp_from','smtp_to','sftp_host','sftp_port','sftp_user','sftp_password','sftp_path','gdrive_folder_id','gdrive_credentials','auto_cron','auto_groups'].forEach(k=>{if(fd.get(k)!==null)values[k]=String(fd.get(k));});
      ['smtp_enabled','smtp_tls','sftp_enabled','gdrive_enabled','auto_enabled'].forEach(k=>values[k]=fd.get(k)?'1':'0');
      await api('/settings',{method:'PUT',body:JSON.stringify({values})});await loadSettings();toast(t('m.saved'));return;
    }
  }catch(err){toast(err.message,'err');}finally{if(btn)btn.disabled=false;}
});
document.addEventListener('input',e=>{
  if(e.target.id==='dev-search'){state.search=e.target.value;const tb=document.getElementById('device-tbody');if(tb)tb.innerHTML=deviceRows();}
  if(e.target.id==='login-opacity'){
    const v=Number(e.target.value), a=String(v/100);
    const label=document.getElementById('opacity-val'); if(label)label.textContent=v+'%';
    const pv=document.getElementById('opacity-preview'); if(pv)pv.style.setProperty('--pv',a);
    document.documentElement.style.setProperty('--login-opacity',a);
  }
});
document.addEventListener('change',async(e)=>{
  if(e.target.id==='dev-group'){state.filterGroup=e.target.value;const tb=document.getElementById('device-tbody');if(tb)tb.innerHTML=deviceRows();}
  if(e.target.id==='backup-filter'){state.backupFilter=e.target.value;pageBackups(document.getElementById('content'));}
  if(e.target.id==='check-all'){document.querySelectorAll('input[name=deviceCheck]').forEach(x=>x.checked=e.target.checked);}
  if(e.target.id==='lang-select'||e.target.id==='settings-lang'){setLang(e.target.value);}
  if(e.target.id==='settings-bg-file'){
    const file=e.target.files[0]; if(!file)return;
    const fd=new FormData(); fd.append('file',file);
    try{
      const r=await fetch(API+'/settings/background/upload',{method:'POST',headers:state.token?{'Authorization':'Bearer '+state.token}:{},body:fd});
      const raw=await r.text(); let d={};
      try{d=JSON.parse(raw);}catch{}
      if(!r.ok) throw new Error(d.detail || raw.slice(0,120) || 'Upload failed');
      await setBg(d.url); toast(t('m.uploadOk'));
    }catch(err){toast(err.message,'err');}
  }
});
window.addEventListener('hashchange',()=>{if(state.user)navigate();});
boot();
