/**
 * Frontend: i18n, theme, video grid, comments, feedback, LaTeX (MathJax), Ratings.
 */
const API = '';

const I18N = {
  en: {
    nav_home: 'Home',
    nav_videos: 'Videos',
    nav_about: 'About',
    nav_contact: 'Contact',
    nav_guide: 'Guide',
    guide_title: 'How-to Guide',
    guide_video_title: 'YouTube Video Links',
    guide_image_title: 'Google Drive Image Links',
    guide_latex_title: 'Adding Images in LaTeX',
    nav_updates: 'Updates',
    hero_title: 'Science project videos, explained.',
    hero_lead: 'Curated experiments with clear explanations and discussion.',
    hero_cta: 'Browse videos',
    featured_title: 'Featured',
    videos_title: 'All videos',
    search_placeholder: 'Search title or description...',
    filter_all: 'All categories',
    filter_category: 'Category',
    about_title: 'About',
    about_p1: 'Green Night Zero was created from a simple idea: turn experiment videos, handmade models, and science projects into a learning space that feels clearer, warmer, and deeper.',
    about_p2: 'The goal is to help viewers understand not only how to build a project, but why it works: which force is acting, which reaction is happening, how a circuit operates, and how that knowledge can be used in real life.',
    about_p3: 'The platform uses HTML, CSS, JavaScript, Node.js, Express, SQLite/LibSQL, and MathJax for LaTeX formulas. It also uses AI tools such as Gemini to support translation, content checks, and update automation.',
    about_p4: 'Thank you for visiting, reading, watching, and sharing feedback with Green Night Zero. Every view, comment, and new idea helps this project become more useful for science lovers, students, makers, and the DIY community.',
    about_p5: 'If something is incomplete, a translation feels unnatural, a diagram is not clear enough, or a feature does not work as expected, I am sorry. Green Night Zero is still being built day by day, and I will keep improving it with more care.',
    about_p6: 'I hope Green Night Zero can become a small corner of inspiration, where ordinary materials, curious questions, and modern technology meet to create vivid science lessons.',
    about_donate: 'Support the project at:',
    contact_title: 'Contact',
    contact_email_label: 'Email',
    donate_label: 'Donate:',
    contact_social: 'Find me on social media:',
    feedback_title: 'Send feedback',
    fb_name: 'Name',
    fb_email: 'Email',
    fb_message: 'Message',
    fb_submit: 'Send',
    updates_title: 'News & updates',
    footer_copy: '© Green Night Zero',
    back: '← Back',
    explain_title: 'Explanation (LaTeX)',
    refs_title: 'References',
    comments_title: 'Comments',
    c_name: 'Your name',
    c_comment: 'Your comment',
    c_submit: 'Post comment',
    comment_read: 'Read',
    comment_unread: 'Unread',
    loading: 'Loading…',
    no_videos: 'No videos match your filters.',
    toast_sent: 'Sent successfully.',
    toast_comment: 'Comment posted.',
    toast_error: 'Something went wrong.',
    recommended_products: 'Recommended Tools & Kits',
    series_title: 'Project Series:',
    part_label: 'Part',
    cat_physics: 'Physics',
    cat_chemistry: 'Chemistry',
    cat_biology: 'Biology',
    cat_environmentalscience: 'Environmental Science',
    cat_physicsengineering: 'Physics & Engineering',
    cat_roboticscoding: 'Robotics & Coding',
    cat_aviationcraft: 'Aviation & Craft',
    cat_electronics: 'Electronics',
    cat_thermodynamics: 'Thermodynamics',
    sort_newest: 'Newest first',
    sort_oldest: 'Oldest first',
    sort_title: 'Title A-Z',
    sort_top_rated: 'Top Rated',
    rating_title: 'Rate this project:',
    login: 'Login',
    logout: 'Logout',
    nav_dashboard: 'Dashboard',
    login_title: 'Login',
    register_title: 'Register',
    auth_email: 'Email',
    auth_password: 'Password',
    auth_username: 'Username',
    login_submit: 'Login',
    register_submit: 'Register',
    change_password_title: 'Change Password',
    current_password: 'Current Password',
    new_password: 'New Password',
    change_password_submit: 'Update Password',
    change_email_title: 'Change Email',
    new_email: 'New Email',
    change_email_submit: 'Update Email',
    toast_password_success: 'Password updated successfully.',
    toast_email_success: 'Email updated successfully. Please login again.',
    forgot_link: 'Forgot Password?',
    forgot_password_title: 'Forgot Password',
    forgot_instruction: 'Enter your email to receive a reset token.',
    forgot_submit: 'Request Token',
    reset_password_title: 'Reset Password',
    reset_token: 'Reset Token',
    reset_submit: 'Reset Password',
    back_to_login: 'Back to Login',
    toast_forgot_success: 'Reset token sent! Check your email (or logs).',
    toast_reset_success: 'Password reset successfully. Please login.',
    no_account: "Don't have an account?",
    have_account: 'Already have an account?',
    register_link: 'Register',
    login_link: 'Login',
    dashboard_title: 'User Dashboard',
    edit_project_title: 'Edit Project',
    profile_title: 'Profile',
    notifications_title: 'Notifications',
    ai_add_title: 'Submit Science Project',
    ai_video_url: 'Project or Video URL',
    ai_tex_optional: 'LaTeX Content',
    latex_guide_title: '📖 LaTeX Guide',
    ai_series_title: 'Series Title (Optional)',
    ai_part_number: 'Part Number (Optional)',
    filter_all_topics: 'All topics',
    topic_label: 'Topic',
    topic_label_en: 'Topic (EN)',
    topic_label_vi: 'Topic (VI)',
    ai_tex_en: 'LaTeX Content (English)',
    ai_tex_vi: 'LaTeX Content (Vietnamese - Optional)',
    ai_submit: 'Submit with AI',
    mode_ai: 'AI Auto-Complete',
    mode_manual: 'Direct Post',
    auth_title: 'Title',
    auth_desc: 'Description',
    cancel: 'Cancel',
    save: 'Save',
    preview: 'Preview',
    post_now: 'Post Now',
    ai_affiliate_links: 'Affiliate Links (Name | URL, one per line)',
    manage_id: 'ID',
    manage_title: 'Title',
    manage_category: 'Category',
    manage_actions: 'Actions',
    manage_edit: 'Edit',
    manage_delete: 'Delete',
    manage_no_projects: 'You have no submitted projects.',
    toast_login_success: 'Logged in successfully.',
    toast_register_success: 'Registered successfully. Please login.',
    toast_ai_success: 'Project submitted with AI! Check your notifications.',
    toast_manual_success: 'Project posted successfully!',
    notif_empty: 'No notifications',
    notif_comment_title: 'New comment',
    notif_comment_message: 'You have {count} new comment(s) on "{title}"',
    notif_rating_title: 'New rating',
    notif_rating_message: 'You have {count} new rating(s) on "{title}"',
    notif_success_title: 'Project submitted',
    notif_success_message: 'Your project "{title}" has been added',
    session_expired: 'Session expired due to inactivity',
    ai_translate: 'AI Translate',
    suggest_title: '📷 Add Illustrations?',
    suggest_body: 'Images help explain your project visually and attract more viewers. You can paste image URLs (diagrams, photos, or screenshots).',
    suggest_btn_add: 'Add Images',
    suggest_btn_skip: 'Skip',
    edit_no_images: 'No images added yet.',
    edit_delete_image: 'Delete',
    diagram_caption: 'Diagram',
    toast_update_success: 'Project updated',
    edit_images_label: 'Images / Diagrams',
    edit_image_url_placeholder: 'Paste image URL (https://... or /assets/...)',
    add_image_url: 'Add URL',
    ai_analyze_btn: 'Analyze with AI',
    profile_email: 'Email',
    profile_username: 'Username',
    profile_joined: 'Joined',
    profile_error: 'Failed to load profile',
    manage_heading: 'Submitted Projects',
    add_link: '+ Add Link'
  },
  vi: {
    nav_home: 'Trang chủ',
    nav_videos: 'Video',
    nav_about: 'Giới thiệu',
    nav_contact: 'Liên hệ',
    nav_guide: 'Hướng dẫn',
    guide_title: 'Hướng dẫn sử dụng',
    guide_video_title: 'Link Video YouTube',
    guide_image_title: 'Link Ảnh Google Drive',
    guide_latex_title: 'Thêm Ảnh trong LaTeX',
    nav_updates: 'Cập nhật',
    hero_title: 'Video dự án khoa học, được giải thích rõ ràng.',
    hero_lead: 'Tuyển chọn thí nghiệm kèm giải thích và thảo luận.',
    hero_cta: 'Xem video',
    featured_title: 'Nổi bật',
    videos_title: 'Tất cả video',
    search_placeholder: 'Tìm theo tiêu đề hoặc mô tả...',
    filter_all: 'Tất cả danh mục',
    filter_all_topics: 'Tất cả chủ đề',
    topic_label: 'Chủ đề:',
    topic_label_en: 'Chủ đề (Tiếng Anh - Tùy chọn)',
    topic_label_vi: 'Chủ đề (Tiếng Việt)',
    ai_tex_en: 'Nội dung LaTeX (Tiếng Anh)',
    ai_tex_vi: 'Nội dung LaTeX (Tiếng Việt - Tùy chọn)',
    filter_category: 'Danh mục',
    about_title: 'Giới thiệu',
    about_p1: 'Green Night Zero được tạo ra từ một ý tưởng rất đơn giản: biến những video thí nghiệm, mô hình tự chế và dự án khoa học thành một không gian học tập dễ hiểu hơn, gần gũi hơn và có chiều sâu hơn.',
    about_p2: 'Mục đích của website là giúp người xem không chỉ biết cách làm một dự án, mà còn hiểu vì sao nó hoạt động: lực nào đang tác dụng, phản ứng nào đang xảy ra, mạch điện vận hành ra sao, và kiến thức đó có thể áp dụng vào đời sống như thế nào.',
    about_p3: 'Dự án sử dụng HTML, CSS, JavaScript, Node.js, Express, SQLite/LibSQL và MathJax để hiển thị công thức LaTeX. Bên cạnh đó, Green Night Zero dùng các công cụ AI như Gemini để hỗ trợ dịch thuật, kiểm tra nội dung và tự động hóa quy trình cập nhật.',
    about_p4: 'Xin cảm ơn bạn đã ghé thăm, đọc, xem và góp ý cho Green Night Zero. Mỗi lượt xem, mỗi phản hồi và mỗi ý tưởng mới đều giúp dự án trở nên hữu ích hơn cho những người yêu khoa học, học sinh, sinh viên, người thích chế tạo và cộng đồng DIY.',
    about_p5: 'Nếu trong quá trình sử dụng bạn gặp nội dung chưa hoàn chỉnh, bản dịch chưa thật tự nhiên, hình minh họa chưa đủ rõ hoặc tính năng nào đó hoạt động chưa như mong muốn, mình thật sự xin lỗi. Green Night Zero vẫn đang được xây dựng từng ngày và sẽ tiếp tục được chỉnh sửa cẩn thận hơn.',
    about_p6: 'Mình hy vọng Green Night Zero có thể trở thành một góc nhỏ truyền cảm hứng, nơi những vật liệu bình thường, những câu hỏi tò mò và những công nghệ hiện đại cùng gặp nhau để tạo nên các bài học khoa học sống động.',
    about_donate: 'Ủng hộ dự án tại:',
    contact_title: 'Liên hệ',
    contact_email_label: 'Thư điện tử',
    donate_label: 'Ủng hộ dự án:',
    contact_social: 'Tìm tôi trên mạng xã hội:',
    feedback_title: 'Gửi phản hồi',
    fb_name: 'Họ tên',
    fb_email: 'Thư điện tử',
    fb_message: 'Nội dung',
    fb_submit: 'Gửi',
    updates_title: 'Tin tức & cập nhật',
    footer_copy: '© Green Night Zero',
    sponsored: 'Được tài trợ',
    back: '← Quay lại',
    explain_title: 'Giải thích (LaTeX)',
    refs_title: 'Tham khảo',
    comments_title: 'Bình luận',
    c_name: 'Tên của bạn',
    c_comment: 'Nội dung bình luận',
    c_submit: 'Gửi bình luận',
    loading: 'Đang tải…',
    no_videos: 'Không có video phù hợp bộ lọc.',
    toast_sent: 'Đã gửi thành công.',
    toast_comment: 'Đã đăng bình luận.',
    toast_error: 'Đã có lỗi xảy ra.',
    recommended_products: 'Dụng cụ & Bộ thiết bị gợi ý',
    sort_newest: 'Mới nhất',
    sort_oldest: 'Cũ nhất',
    sort_title: 'Tên A-Z',
    series_title: 'Chuỗi dự án:',
    part_label: 'Phần',
    cat_physics: 'Vật lý',
    cat_chemistry: 'Hóa học',
    cat_biology: 'Sinh học',
    cat_environmentalscience: 'Khoa học Môi trường',
    cat_physicsengineering: 'Vật lý & Kỹ thuật',
    cat_roboticscoding: 'Robot & Lập trình',
    cat_aviationcraft: 'Hàng không & Thủ công',
    cat_electronics: 'Điện tử',
    cat_thermodynamics: 'Nhiệt động lực học',
    sort_top_rated: 'Đánh giá cao nhất',
    rating_title: 'Đánh giá dự án này:',
    login: 'Đăng nhập',
    logout: 'Đăng xuất',
    nav_dashboard: 'Cá nhân',
    login_title: 'Đăng nhập',
    register_title: 'Đăng ký',
    auth_email: 'Email',
    auth_password: 'Mật khẩu',
    auth_username: 'Tên người dùng',
    login_submit: 'Đăng nhập',
    register_submit: 'Đăng ký',
    change_password_title: 'Đổi mật khẩu',
    current_password: 'Mật khẩu hiện tại',
    new_password: 'Mật khẩu mới',
    change_password_submit: 'Cập nhật mật khẩu',
    change_email_title: 'Đổi Email',
    new_email: 'Email mới',
    change_email_submit: 'Cập nhật Email',
    toast_password_success: 'Đổi mật khẩu thành công.',
    toast_email_success: 'Đổi Email thành công. Vui lòng đăng nhập lại.',
    forgot_link: 'Quên mật khẩu?',
    forgot_password_title: 'Quên mật khẩu',
    forgot_instruction: 'Nhập email của bạn để nhận mã khôi phục.',
    forgot_submit: 'Gửi yêu cầu',
    reset_password_title: 'Đặt lại mật khẩu',
    reset_token: 'Mã khôi phục',
    reset_submit: 'Đặt lại mật khẩu',
    back_to_login: 'Quay lại đăng nhập',
    toast_forgot_success: 'Mã khôi phục đã được gửi! Kiểm tra email (hoặc log).',
    toast_reset_success: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập.',
    no_account: 'Chưa có tài khoản?',
    have_account: 'Đã có tài khoản?',
    register_link: 'Đăng ký ngay',
    login_link: 'Đăng nhập ngay',
    dashboard_title: 'Bảng điều khiển cá nhân',
    edit_project_title: 'Sửa dự án',
    profile_title: 'Hồ sơ',
    notifications_title: 'Thông báo',
    ai_add_title: 'Gửi dự án khoa học',
    ai_video_url: 'Link dự án hoặc video',
    ai_tex_optional: 'Nội dung LaTeX (Bắt buộc nếu đăng trực tiếp)',
    latex_guide_title: '📖 Hướng dẫn LaTeX',
    ai_series_title: 'Tên bộ phim/chuỗi (tùy chọn)',
    ai_part_number: 'Tập số (tùy chọn)',
    ai_submit: 'Gửi bằng AI',
    mode_ai: 'AI Tự động hoàn thiện',
    mode_manual: 'Đăng trực tiếp',
    auth_title: 'Tiêu đề',
    auth_desc: 'Mô tả',
    cancel: 'Hủy',
    save: 'Lưu',
    preview: 'Xem trước',
    post_now: 'Đăng ngay',
    ai_affiliate_links: 'Link tiếp thị liên kết (Tên | URL, mỗi dòng một link)',
    manage_id: 'ID',
    manage_title: 'Tiêu đề',
    manage_category: 'Danh mục',
    manage_actions: 'Hành động',
    manage_edit: 'Sửa',
    manage_delete: 'Xóa',
    manage_no_projects: 'Bạn chưa có dự án nào được gửi.',
    toast_login_success: 'Đăng nhập thành công.',
    toast_register_success: 'Đăng ký thành công. Hãy đăng nhập.',
    toast_ai_success: 'Đã gửi dự án AI! Hãy xem thông báo.',
    toast_manual_success: 'Đã đăng dự án thành công!',
    notif_empty: 'Không có thông báo',
    notif_comment_title: 'Bình luận mới',
    notif_comment_message: 'Bạn có {count} bình luận mới trên "{title}"',
    notif_rating_title: 'Đánh giá mới',
    notif_rating_message: 'Bạn có {count} đánh giá mới trên "{title}"',
    notif_success_title: 'Đã gửi dự án',
    notif_success_message: 'Dự án "{title}" đã được thêm',
    session_expired: 'Phiên đã hết hạn do không hoạt động',
    ai_translate: 'AI Dịch',
    suggest_title: '📷 Thêm hình ảnh minh họa?',
    suggest_body: 'Hình ảnh giúp giải thích trực quan và thu hút người xem hơn. Bạn có thể dán URL hình ảnh (sơ đồ, ảnh chụp hoặc ảnh minh họa).',
    suggest_btn_add: 'Thêm hình ảnh',
    suggest_btn_skip: 'Bỏ qua',
    edit_no_images: 'Chưa có ảnh nào.',
    edit_delete_image: 'Xóa',
    diagram_caption: 'Sơ đồ',
    toast_update_success: 'Đã cập nhật dự án',
    edit_images_label: 'Hình ảnh / Sơ đồ',
    edit_image_url_placeholder: 'Dán URL hình ảnh (https://... hoặc /assets/...)',
    add_image_url: 'Thêm URL',
    ai_analyze_btn: 'Phân tích bằng AI',
    profile_email: 'Thư điện tử',
    profile_username: 'Tên người dùng',
    profile_joined: 'Tham gia từ',
    profile_error: 'Không thể tải hồ sơ',
    manage_heading: 'Dự án đã gửi',
    add_link: '+ Thêm liên kết'
  }
};

function getDisplayCategory(cat) {
  const key = 'cat_' + String(cat).toLowerCase().replace(/\s+/g, '').replace('&', '');
  return I18N[lang][key] || cat;
}

function getDisplayTopic(video) {
  if (!video) return '';
  if (lang === 'vi') return video.topicVi || video.topic || '';
  return video.topic || '';
}

let lang = localStorage.getItem('lang') || 'en';
let editLang = lang;
let editImages = [];
let theme = localStorage.getItem('theme') || 'light';
let allVideos = [];
let displayedVideos = [];
let allNotifications = [];
let userProfileCache = null;
let allManageProjects = [];
let selectedVideoId = null;
let currentOffset = 0;
const PAGE_SIZE = 12;
let totalVideos = 0;

let allUpdates = JSON.parse(localStorage.getItem('gnz_updates_cache')) || [];
let updatesOffset = 0;
const UPDATES_PAGE_SIZE = 20;
let hasMoreUpdates = true;
let lastUpdatesFetch = 0;
const UPDATES_CACHE_TTL = 60000;

function $(sel) { return document.querySelector(sel); }

function showToast(message) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove('show'), 4000);
}

function proxyImageUrl(url) {
  if (typeof url !== 'string') return url;
  if (!url.includes('drive.google.com') && !url.includes('docs.google.com')) return url;
  let fileId = null;
  try {
    const u = new URL(url);
    fileId = u.searchParams.get('id');
    if (!fileId) {
      const m = u.pathname.match(/\/file\/d\/([^/]+)/);
      if (m) fileId = m[1];
    }
  } catch {}
  if (fileId) {
    return `/api/proxy-image?url=${encodeURIComponent('https://drive.google.com/uc?export=download&id=' + fileId + '&confirm=t')}`;
  }
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  const btn = $('#themeToggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
}

function applyLang() {
  document.documentElement.lang = lang === 'vi' ? 'vi' : 'en';
  const btn = $('#langToggle');
  if (btn) btn.textContent = lang === 'vi' ? 'VI' : 'EN';
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.getAttribute('data-i18n');
    if (I18N[lang][key]) node.textContent = I18N[lang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    const key = node.getAttribute('data-i18n-placeholder');
    if (I18N[lang][key]) node.setAttribute('placeholder', I18N[lang][key]);
  });
  document.querySelectorAll('.lang-en, .lang-vi').forEach((node) => {
    node.style.display = node.classList.contains('lang-' + lang) ? '' : 'none';
  });
  localStorage.setItem('lang', lang);
}

function navigate(page) {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  const el = $('#page-' + page);
  if (el) el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function fetchVideos(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/api/videos${q ? `?${q}` : ''}`);
  const data = await res.json();
  if (!data.ok) throw new Error('videos');
  return data.videos;
}

function getYoutubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/embed/')) return u.pathname.split('/')[2];
      return u.searchParams.get('v');
    }
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1);
    }
  } catch (_) {}
  return null;
}

function getVimeoId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('vimeo.com')) {
      if (u.pathname.startsWith('/video/')) return u.pathname.split('/')[2];
    }
  } catch (_) {}
  return null;
}

function videoCard(video) {
  const div = document.createElement('div');
  div.className = 'card';
  const displayTitle = (lang === 'vi' && video.titleVi) ? video.titleVi : video.title;
  const displayDesc = (lang === 'vi' && video.descriptionVi) ? video.descriptionVi : video.description;
  const displayCat = getDisplayCategory(video.category);
  const displayTopic = getDisplayTopic(video);
  
  const ytid = getYoutubeId(video.embedUrl);
  const vmid = getVimeoId(video.embedUrl);
  
  let thumbSrc = '';
  if (ytid) thumbSrc = `https://img.youtube.com/vi/${ytid}/mqdefault.jpg`;
  else if (video.imageUrls && video.imageUrls.length > 0) thumbSrc = video.imageUrls[0];
  
  div.innerHTML = `
    <div class="tag-row" style="display: flex; gap: 0.4rem; margin-bottom: 0.5rem;">
      <div class="tag">${escapeHtml(displayCat)}</div>
      ${displayTopic ? `<div class="tag secondary" style="background: var(--primary-light); color: var(--primary);">${escapeHtml(displayTopic)}</div>` : ''}
    </div>
    <h3>${escapeHtml(displayTitle)}</h3>
    <div class="card-rating" style="color: #fbbf24; font-size: 0.9rem; margin-bottom: 0.5rem;">
      ★ ${video.avgRating ? Number(video.avgRating).toFixed(1) : '0.0'} <span class="muted">(${video.ratingCount || 0})</span>
    </div>
    <p class="muted">${escapeHtml(displayDesc)}</p>
    <div class="thumb-wrap" tabindex="0" role="button" aria-label="${escapeHtml(displayTitle)}">
      ${thumbSrc
        ? `<img class="thumb-img" src="${thumbSrc}" alt="${escapeHtml(displayTitle)}" loading="lazy">
           <div class="play-overlay"></div>`
        : `<iframe src="${sanitizeIframeSrc(video.embedUrl)}" title="${escapeHtml(video.title)}" loading="lazy" allowfullscreen></iframe>`
      }
    </div>
    <button type="button" class="btn primary open-detail" data-id="${video.id}">
      ${lang === 'vi' ? 'Chi tiết' : 'Details'}
    </button>
  `;
  if (ytid || vmid) {
    div.querySelector('.thumb-wrap').addEventListener('click', () => openDetail(video.id));
  }
  div.querySelector('.open-detail').addEventListener('click', (e) => { e.stopPropagation(); openDetail(video.id); });
  return div;
}

function sanitizeIframeSrc(url) {
  if (!url) return '';
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const u = new URL(url);
      return u.href;
    }
    return url;
  } catch (_) {}
  return '';
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderFeaturedFromCache() {
  const grid = $('#featuredGrid');
  if (!grid) return;
  const topVideos = [...allVideos].sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
  grid.innerHTML = '';
  const fragment = document.createDocumentFragment();
  topVideos.slice(0, 3).forEach((v) => fragment.appendChild(videoCard(v)));
  grid.appendChild(fragment);
}

async function renderFeatured() {
  if (allVideos.length > 0) { renderFeaturedFromCache(); return; }
  const grid = $('#featuredGrid');
  if (!grid) return;
  try {
    const res = await fetch(`${API}/api/videos?limit=3&sort=top_rated`);
    const data = await res.json();
    if (!data.ok) throw new Error();
    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    data.videos.forEach((v) => fragment.appendChild(videoCard(v)));
    grid.appendChild(fragment);
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p class="muted">Featured videos unavailable</p>`;
  }
}

function renderVideoGridFromCache() {
  const grid = $('#videoGrid');
  if (!grid) return;
  grid.innerHTML = '';
  if (displayedVideos.length === 0) {
    grid.innerHTML = `<p class="muted">${I18N[lang].no_videos}</p>`;
    $('#loadMoreContainer').style.display = 'none';
    return;
  }
  const fragment = document.createDocumentFragment();
  displayedVideos.forEach((v) => fragment.appendChild(videoCard(v)));
  grid.appendChild(fragment);
  const loadMoreContainer = $('#loadMoreContainer');
  if (loadMoreContainer) {
    loadMoreContainer.style.display = displayedVideos.length < totalVideos ? 'block' : 'none';
  }
}

function populateCategories() {
  const sel = $('#categoryFilter');
  if (!sel) return;
  const cats = [...new Set(allVideos.map((v) => v.category))].sort();
  const current = sel.value;
  sel.innerHTML = `<option value="">${I18N[lang].filter_all}</option>`;
  cats.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = getDisplayCategory(c);
    sel.appendChild(opt);
  });
  sel.value = cats.includes(current) ? current : '';
}

function populateTopics() {
  const sel = $('#topicFilter');
  if (!sel) return;
  const topics = [...new Set(allVideos.map((v) => v.topic))].filter(Boolean).sort();
  const current = sel.value;
  sel.innerHTML = `<option value="">${I18N[lang].filter_all_topics}</option>`;
  topics.forEach((t) => {
    const videoWithTopic = allVideos.find(v => v.topic === t);
    const display = getDisplayTopic(videoWithTopic);
    const opt = document.createElement('option');
    opt.value = t; opt.textContent = display;
    sel.appendChild(opt);
  });
  sel.value = topics.includes(current) ? current : '';
}

function populateManualCategoryTopic() {
  if (!allVideos || !allVideos.length) return;

  const catSel = $('#manualCategory');
  if (catSel) {
    const cur = catSel.value;
    const cats = [...new Set(allVideos.map(v => v.category))].sort();
    catSel.innerHTML = '<option value=""></option>';
    cats.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = getDisplayCategory(c);
      catSel.appendChild(opt);
    });
    if (cats.includes(cur)) catSel.value = cur;
  }

  const topicSel = $('#manualTopic');
  if (topicSel) {
    const cur = topicSel.value;
    const topics = [...new Set(allVideos.map(v => v.topic))].filter(Boolean).sort();
    topicSel.innerHTML = '<option value=""></option>';
    topics.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = t;
      topicSel.appendChild(opt);
    });
    if (topics.includes(cur)) topicSel.value = cur;
  }

  const topicViSel = $('#manualTopicVi');
  if (topicViSel) {
    const cur = topicViSel.value;
    const topicVis = [...new Set(allVideos.map(v => v.topicVi))].filter(Boolean).sort();
    topicViSel.innerHTML = '<option value=""></option>';
    topicVis.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = t;
      topicViSel.appendChild(opt);
    });
    if (topicVis.includes(cur)) topicViSel.value = cur;
  }
}

async function loadMore() {
  currentOffset += PAGE_SIZE;
  await renderVideoGrid(false, true);
}

async function renderVideoGrid(bypassCache = false, isAppend = false) {
  const grid = $('#videoGrid');
  if (!grid) return;
  
  const q = $('#searchInput').value.trim().toLowerCase();
  const category = $('#categoryFilter').value;
  const topic = $('#topicFilter').value;
  const sort = $('#sortFilter').value;

  if (!isAppend) {
    currentOffset = 0;
    grid.innerHTML = '';
  }

  // Client-side filtering when we have all data cached
  if (!bypassCache && allVideos.length >= totalVideos && totalVideos > 0) {
    let filtered = [...allVideos];
    if (q) {
      filtered = filtered.filter((v) => {
        const title = (v.title || '').toLowerCase();
        const titleVi = (v.titleVi || '').toLowerCase();
        const desc = (v.description || '').toLowerCase();
        const descVi = (v.descriptionVi || '').toLowerCase();
        return title.includes(q) || titleVi.includes(q) || desc.includes(q) || descVi.includes(q);
      });
    }
    if (category) filtered = filtered.filter((v) => v.category === category);
    if (topic) filtered = filtered.filter((v) => v.topic === topic);
    if (sort === 'top_rated') {
      filtered.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    } else if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    }

    const total = filtered.length;
    const offset = currentOffset;
    const limit = PAGE_SIZE;
    const page = filtered.slice(offset, offset + limit);

    totalVideos = total;
    displayedVideos = isAppend ? [...displayedVideos, ...page] : page;

    if (!page.length && !isAppend) {
      grid.innerHTML = `<p class="muted">${I18N[lang].no_videos}</p>`;
      $('#loadMoreContainer').style.display = 'none';
      return;
    }

    const fragment = document.createDocumentFragment();
    page.forEach((v) => fragment.appendChild(videoCard(v)));
    grid.appendChild(fragment);

    const loadMoreContainer = $('#loadMoreContainer');
    if (loadMoreContainer) {
      loadMoreContainer.style.display = displayedVideos.length < totalVideos ? 'block' : 'none';
    }
    return;
  }

  try {
    const params = {
      limit: PAGE_SIZE,
      offset: currentOffset,
      q,
      category,
      topic,
      sort
    };
    
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API}/api/videos?${query}`);
    const data = await res.json();
    
    if (!data.ok) throw new Error();

    totalVideos = data.total;
    const videos = data.videos;

    // Update cache: allVideos accumulates all fetched data (never cleared)
    // displayedVideos tracks the current page subset
    if (!isAppend) {
      displayedVideos = videos;
      const existingIds = new Set(allVideos.map(v => v.id));
      videos.forEach(v => { if (!existingIds.has(v.id)) { allVideos.push(v); existingIds.add(v.id); } });
    } else {
      displayedVideos = [...displayedVideos, ...videos];
      const existingIds = new Set(allVideos.map(v => v.id));
      videos.forEach(v => { if (!existingIds.has(v.id)) { allVideos.push(v); existingIds.add(v.id); } });
    }

    if (!videos.length && !isAppend) {
      grid.innerHTML = `<p class="muted">${I18N[lang].no_videos}</p>`;
      $('#loadMoreContainer').style.display = 'none';
      return;
    }

    const fragment = document.createDocumentFragment();
    videos.forEach((v) => fragment.appendChild(videoCard(v)));
    grid.appendChild(fragment);

    const loadMoreContainer = $('#loadMoreContainer');
    if (loadMoreContainer) {
      loadMoreContainer.style.display = displayedVideos.length < totalVideos ? 'block' : 'none';
    }
  } catch (err) {
    console.error(err);
    if (!isAppend) grid.innerHTML = `<p class="muted">${I18N[lang].toast_error}</p>`;
  }
}

function ensureMathJax() {
  if (!document.getElementById('MathJax-script')) {
    const script = document.createElement('script');
    script.id = 'MathJax-script';
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    document.head.appendChild(script);
  }
}

async function openDetail(id) {
  ensureMathJax();
  selectedVideoId = id;
  // Try to get basic info from cache first
  let video = allVideos.find((v) => v.id === id);
  if (!video) return;
  // Fetch full details (with explanation fields) from the detail endpoint
  try {
    const detailRes = await fetch(`${API}/api/videos/${id}`);
    const detailData = await detailRes.json();
    if (detailData.ok && detailData.video) {
      // Merge full detail into cached object for future use
      const idx = allVideos.findIndex(v => v.id === id);
      if (idx >= 0) allVideos[idx] = detailData.video;
      video = detailData.video;
    }
  } catch (_) {}
  navigate('detail');
  
  const seriesNav = $('#seriesNav');
  if (seriesNav) {
    seriesNav.innerHTML = '';
    if (video.seriesTitle) {
      const parts = allVideos
        .filter(v => v.seriesTitle === video.seriesTitle)
        .sort((a, b) => (a.partNumber || 0) - (b.partNumber || 0));

      if (parts.length > 1) {
        seriesNav.innerHTML = `<h4>${I18N[lang].series_title} ${escapeHtml(video.seriesTitle)}</h4>`;
        parts.forEach(p => {
          const btn = document.createElement('button');
          btn.className = `part-btn ${p.id === video.id ? 'active' : ''}`;
          btn.textContent = `${I18N[lang].part_label} ${p.partNumber || ''}`;
          btn.onclick = () => openDetail(p.id);
          seriesNav.appendChild(btn);
        });
      }
    }
  }

  const videoContent = $('#videoContent');
  if (videoContent) {
    const isYoutube = video.embedUrl.includes('youtube.com') || video.embedUrl.includes('youtu.be');
    const isVimeo = video.embedUrl.includes('vimeo.com');
    const displayTitle = (lang === 'vi' && video.titleVi) ? video.titleVi : video.title;
    const displayDesc = (lang === 'vi' && video.descriptionVi) ? video.descriptionVi : video.description;
    const displayCat = getDisplayCategory(video.category);
    const displayTopic = getDisplayTopic(video);

    videoContent.innerHTML = `
      <div class="meta-row" style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
        <span class="tag">${escapeHtml(displayCat)}</span>
        ${displayTopic ? `<span class="tag secondary">${escapeHtml(displayTopic)}</span>` : ''}
      </div>
      <h1>${escapeHtml(displayTitle)}</h1>
      <p>${escapeHtml(displayDesc)}</p>
      <div class="thumb-wrap">
        ${(isYoutube || isVimeo)
          ? `<iframe src="${sanitizeIframeSrc(video.embedUrl)}" title="${escapeHtml(video.title)}" allowfullscreen></iframe>`
          : `<video src="${escapeHtml(video.embedUrl)}" controls style="width:100%; height:100%; object-fit:cover;"></video>`
        }
      </div>
      <div class="rating-container card" style="display: flex; align-items: center; gap: 1rem; margin-top: 1rem;">
        <span data-i18n="rating_title">${I18N[lang].rating_title}</span>
        <div class="stars" id="starRating" style="display: flex; flex-direction: row-reverse; gap: 0.2rem; cursor: pointer;">
          <span class="star" data-value="5" style="font-size: 1.5rem; color: #ccc;">★</span>
          <span class="star" data-value="4" style="font-size: 1.5rem; color: #ccc;">★</span>
          <span class="star" data-value="3" style="font-size: 1.5rem; color: #ccc;">★</span>
          <span class="star" data-value="2" style="font-size: 1.5rem; color: #ccc;">★</span>
          <span class="star" data-value="1" style="font-size: 1.5rem; color: #ccc;">★</span>
        </div>
        <div class="rating-value" style="font-weight: bold;">${video.avgRating ? Number(video.avgRating).toFixed(1) : '0.0'} (${video.ratingCount || 0})</div>
      </div>
    `;
    
    const stars = $('#starRating').querySelectorAll('.star');
    stars.forEach(s => {
      s.onmouseover = () => {
          const val = Number(s.getAttribute('data-value'));
          stars.forEach(st => {
              if (Number(st.getAttribute('data-value')) <= val) st.style.color = '#fbbf24';
              else st.style.color = '#ccc';
          });
      };
      s.onmouseout = () => {
          stars.forEach(st => st.style.color = '#ccc');
      };
      s.onclick = async () => {
        const score = Number(s.getAttribute('data-value'));
        try {
          const res = await fetch(`${API}/api/ratings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoId: id, score })
          });
          if (!res.ok) throw new Error();
          showToast(lang === 'vi' ? 'Cảm ơn bạn đã đánh giá!' : 'Thank you for your rating!');
          // Update local cache only — no full re-fetch
          try {
            const statsRes = await fetch(`${API}/api/ratings?videoId=${id}`);
            const statsData = await statsRes.json();
            if (statsData.ok) {
              const video1 = allVideos.find(v => v.id === id);
              if (video1) { video1.avgRating = statsData.rating; video1.ratingCount = statsData.count; }
              const video2 = displayedVideos.find(v => v.id === id);
              if (video2) { video2.avgRating = statsData.rating; video2.ratingCount = statsData.count; }
              const ratingDisplay = document.querySelector('.rating-value');
              if (ratingDisplay) {
                ratingDisplay.textContent = `${statsData.rating ? Number(statsData.rating).toFixed(1) : '0.0'} (${statsData.count || 0})`;
              }
            }
          } catch (_) {}
        } catch { showToast(I18N[lang].toast_error); }
      };
    });
  }

  const refsList = $('#detailRefs');
  if (refsList) {
    refsList.innerHTML = (video.referenceLinks || [])
      .map(r => `<li><a href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.label || r.url)}</a></li>`)
      .join('') || `<li class="muted">—</li>`;
  }

  const affiliateList = $('#affiliateList');
  if (affiliateList) {
    affiliateList.innerHTML = (video.affiliateLinks || [])
      .map(product => {
        const name = product.name || product.label || (lang === 'vi' ? 'Sản phẩm gợi ý' : 'Recommended Product');
        const price = product.price || '';
        const links = product.links || (product.url ? [{ label: (lang === 'vi' ? 'Mua ngay' : 'Buy now'), url: product.url }] : []);

        return `
          <div class="affiliate-item">
            <div class="product-info">
              <strong>${escapeHtml(name)}</strong>
              ${price ? `<div class="price">${escapeHtml(price)}</div>` : ''}
            </div>
            <div class="links-group">
              ${links.length > 0 
                ? links.map(link => `
                    <a href="${escapeHtml(link.url || '#')}" target="_blank" class="btn primary small affiliate-btn">
                      ${escapeHtml(link.label || (lang === 'vi' ? 'Xem shop' : 'View Shop'))}
                    </a>
                  `).join('')
                : `<button class="btn ghost small" disabled>${lang === 'vi' ? 'Hết hàng' : 'Out of stock'}</button>`
              }
            </div>
          </div>`;
      })
      .join('') || `<p class="muted">${lang === 'vi' ? 'Chưa có sản phẩm gợi ý.' : 'No recommended products yet.'}</p>`;
  }

  const markdownBody = $('#markdownBody');
  if (markdownBody) {
    markdownBody.innerHTML = `<p class="muted">${I18N[lang].loading}</p>`;
    markdownBody.style.whiteSpace = 'pre-wrap';
    try {
      const texText = (lang === 'vi' ? (video.explanationViContent || video.explanationContent) : (video.explanationContent || video.explanationViContent)) || '';
      if (!texText) throw new Error('No content');
      let html = texText
        .replace(/\\section\*?\{([^}]*)\}/g, '<h2>$1</h2>')
        .replace(/\\subsection\*?\{([^}]*)\}/g, '<h3>$1</h3>')
        .replace(/\\textbf\{([^}]*)\}/g, '<b>$1</b>')
        .replace(/\\textit\{([^}]*)\}/g, '<i>$1</i>')
        .replace(/\\includegraphics\s*(\[[^\]]*\])?\s*\{([^}]*)\}/g, (match, options, path) => {
          const trimmedPath = path.replace(/\s+/g, '');
          let caption = '';
          if (options) caption = options.slice(1, -1).trim();
          else caption = trimmedPath.startsWith('data:') ? I18N[lang].diagram_caption : trimmedPath.split('/').pop().replace(/[-_]/g, ' ').replace(/\.\w+$/g, '').replace(/\b\w/g, c => c.toUpperCase());
          const errMsg = lang === 'vi' ? 'Không tải được sơ đồ' : 'Diagram unavailable';
          return `<figure class="diagram-figure mathjax_ignore">
                    <img src="${proxyImageUrl(trimmedPath)}" alt="${escapeHtml(caption || errMsg)}" loading="lazy" style="max-width:100%; border-radius:8px; box-shadow:var(--shadow); display:inline-block;" onerror="this.style.display='none';var e=this.nextElementSibling;if(e){e.hidden=false;e.textContent=this.alt||'${escapeHtml(errMsg)}';}">
                    <p class="diagram-error" hidden></p>
                  </figure>`;
        })
        .replace(/\\begin\{center\}/g, '<div style="text-align:center;">')
        .replace(/\\end\{center\}/g, '</div>')
        .replace(/\\begin\{itemize\}/g, '<ul style="margin-left:1.5rem;">')
        .replace(/\\end\{itemize\}/g, '</ul>')
        .replace(/\\begin\{enumerate\}/g, '<ol style="margin-left:1.5rem;">')
        .replace(/\\end\{enumerate\}/g, '</ol>')
        .replace(/\\item/g, '<li>');

      html = html
        .replace(/\\\{/g, '{')
        .replace(/\\\}/g, '}')
        .replace(/\\begin\{tabular\}\{[^}]*\}([\s\S]*?)\\end\{tabular\}/g, (match, content) => {
        const rows = content.trim().split('\\\\').filter(r => r.trim());
        const tableRows = rows.map(row => {
          const cols = row.split('&').map(c => `<td style="padding:10px; border:1px solid var(--border);">${c.replace(/\\hline/g, '').trim()}</td>`).join('');
          return `<tr>${cols}</tr>`;
        }).join('');
        return `<div style="overflow-x:auto; margin:1rem 0;"><table style="width:100%; border-collapse:collapse; background:var(--surface); border:1px solid var(--border);">${tableRows}</table></div>`;
      });
      // Render-time fallback: replace remaining placeholders with gallery images
      if (video.imageUrls && video.imageUrls.length > 0) {
        const firstUrl = video.imageUrls[0];
        const altEn = 'Diagram';
        const altVi = 'Sơ đồ';
        const imgTag = `<figure class="diagram-figure mathjax_ignore"><img src="${firstUrl}" alt="Diagram" loading="lazy" style="max-width:100%; border-radius:8px; box-shadow:var(--shadow); display:inline-block;"><p class="diagram-error" hidden></p></figure>`;
        html = html
          .replace(/\{?\s*\\?textit\s*\{[^}]*Replace with your own diagram[^}]*\}\s*\}?/gi, imgTag)
          .replace(/\{?\s*\\?textit\s*\{[^}]*Thay thế bằng hình ảnh của bạn[^}]*\}\s*\}?/gi, imgTag);
      }

      markdownBody.innerHTML = html;
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([markdownBody]).catch(e => console.error(e));
      }
    } catch {
      markdownBody.innerHTML = `<p class="muted">Error loading: ${video.explanation}</p>`;
    }
  }

  const form = $('#commentForm');
  if (form) {
    form.onsubmit = onCommentSubmit;
    const vIdInput = form.querySelector('input[name="videoId"]');
    if (vIdInput) vIdInput.value = id;
  }
  await loadComments(id);
}

async function loadComments(videoId) {
  const list = $('#commentList');
  if (!list) return;
  try {
    const res = await fetch(`${API}/api/comments?videoId=${encodeURIComponent(videoId)}`);
    const data = await res.json();
    if (!data.ok) throw new Error();
    list.innerHTML = '';
    list.dataset.videoId = videoId;
    const isAdmin = currentUser?.role === 'admin';
    data.comments.forEach((c) => {
      const li = document.createElement('li');
      let badgeHtml = '';
      if (isAdmin) {
        const label = c.isRead ? I18N[lang].comment_read : I18N[lang].comment_unread;
        badgeHtml = ` <button class="comment-status ${c.isRead ? 'read' : 'unread'}" data-id="${c.id}" data-read="${c.isRead ? 'true' : 'false'}">${label}</button>`;
      }
      li.innerHTML = `<div class="comment-meta">${escapeHtml(c.username)} · ${new Date(c.timestamp).toLocaleString()}${badgeHtml}</div><div>${escapeHtml(c.content)}</div>`;
      list.appendChild(li);
    });
  } catch {
    list.innerHTML = `<li class="muted">${I18N[lang].toast_error}</li>`;
  }
}

async function onCommentSubmit(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = { videoId: Number(fd.get('videoId')), username: fd.get('username'), content: fd.get('content') };
  try {
    const res = await fetch(`${API}/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error();
    e.target.reset();
    showToast(I18N[lang].toast_comment);
    await loadComments(payload.videoId);
  } catch {
    showToast(I18N[lang].toast_error);
  }
}

async function loadUpdates(isAppend = false) {
  const ul = $('#updatesList');
  if (!ul) return;

  if (!isAppend) {
    updatesOffset = 0;
    hasMoreUpdates = true;
    if (allUpdates.length > 0) {
      renderUpdates(allUpdates);
      if (Date.now() - lastUpdatesFetch < UPDATES_CACHE_TTL) return;
    } else {
      ul.innerHTML = `<li class="muted updates-skeleton">${I18N[lang].loading}</li>`;
    }
  }

  try {
    const res = await fetch(`${API}/api/updates?limit=${UPDATES_PAGE_SIZE}&offset=${updatesOffset}`);
    const data = await res.json();
    if (!data.ok) throw new Error();

    lastUpdatesFetch = Date.now();

    if (!isAppend) {
      allUpdates = data.updates;
    } else {
      const existingIds = new Set(allUpdates.map(u => u.id));
      data.updates.forEach(u => {
        if (!existingIds.has(u.id)) allUpdates.push(u);
      });
    }

    localStorage.setItem('gnz_updates_cache', JSON.stringify(allUpdates.slice(0, 40)));
    hasMoreUpdates = data.updates.length === UPDATES_PAGE_SIZE;
    renderUpdates(allUpdates);
  } catch {
    if (allUpdates.length === 0) {
      ul.innerHTML = `<li class="muted">${I18N[lang].toast_error}</li>`;
    }
  }
}

function renderUpdates(updates) {
  const ul = $('#updatesList');
  if (!ul) return;

  if (updates.length === 0) {
    ul.innerHTML = `<li class="muted">${lang === 'vi' ? 'Chưa có bản tin nào.' : 'No updates yet.'}</li>`;
    return;
  }

  const firstChild = ul.firstElementChild;
  if (firstChild && !firstChild.hasAttribute('data-id')) {
    ul.innerHTML = '';
  }

  const existingIds = new Set();
  ul.querySelectorAll('li[data-id]').forEach(li => {
    existingIds.add(li.getAttribute('data-id'));
  });

  const fragment = document.createDocumentFragment();
  updates.forEach((u) => {
    const id = String(u.id);
    if (existingIds.has(id)) return;

    // Ưu tiên bản tiếng Việt nếu có, nếu không thì dùng bản gốc
    const displayTitle = (lang === 'vi' && u.titleVi && u.titleVi.trim() !== '') ? u.titleVi : u.title;
    const displayBody = (lang === 'vi' && u.bodyVi && u.bodyVi.trim() !== '') ? u.bodyVi : u.body;
    const li = document.createElement('li');
    li.setAttribute('data-id', id);
    li.innerHTML = `
      <strong style="font-size:1.1rem; color:var(--primary);">${escapeHtml(displayTitle)}</strong>
      <div class="muted" style="font-size:0.85rem; margin:0.25rem 0 0.75rem;">${new Date(u.postedAt).toLocaleString()}</div>
      <p style="white-space:pre-wrap; line-height:1.6;">${escapeHtml(displayBody)}</p>
    `;
    fragment.appendChild(li);
  });
  ul.appendChild(fragment);

  const oldBtn = ul.querySelector('.load-more-row');
  if (oldBtn) oldBtn.remove();

  if (hasMoreUpdates) {
    const btnRow = document.createElement('div');
    btnRow.className = 'load-more-row';
    btnRow.style.textAlign = 'center';
    btnRow.style.marginTop = '2rem';
    const btn = document.createElement('button');
    btn.className = 'btn ghost';
    btn.textContent = lang === 'vi' ? 'Tải thêm bản tin' : 'Load more updates';
    btn.onclick = () => {
      updatesOffset += UPDATES_PAGE_SIZE;
      btn.disabled = true;
      btn.textContent = I18N[lang].loading;
      loadUpdates(true);
    };
    btnRow.appendChild(btn);
    ul.appendChild(btnRow);
  }
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(null, args), ms); };
}

// Auth State Management
let currentUser = JSON.parse(localStorage.getItem('user')) || null;
let token = localStorage.getItem('token') || null;

// Inactivity auto-logout — 2 hours
const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000;
let inactivityTimer = null;

function resetInactivityTimer() {
  if (!token) return;
  if (inactivityTimer) clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    if (!token) return;
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateAuthUI();
    navigate('home');
    showToast(I18N[lang].session_expired);
  }, INACTIVITY_TIMEOUT);
}

// Activity event listeners for inactivity timer
['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
  document.addEventListener(evt, resetInactivityTimer, { passive: true });
});

function updateAuthUI() {
  if (currentUser) {
    $('#authActions').style.display = 'none';
    $('#userActions').style.display = 'block';
    $('#userBtn').textContent = currentUser.username;
    $('#navDashboard').style.display = 'inline-block';
  } else {
    $('#authActions').style.display = 'block';
    $('#userActions').style.display = 'none';
    $('#navDashboard').style.display = 'none';
  }
}

function renderProfile() {
  const container = $('#userProfile');
  if (!container || !userProfileCache) return;
  const i18n = I18N[lang];
  const createdDate = new Date(userProfileCache.createdAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US');
  container.innerHTML = `
    <p><strong>${escapeHtml(i18n.profile_email)}:</strong> ${escapeHtml(userProfileCache.email)}</p>
    <p><strong>${escapeHtml(i18n.profile_username)}:</strong> ${escapeHtml(userProfileCache.username)}</p>
    <p><strong>${escapeHtml(i18n.profile_joined)}:</strong> ${createdDate}</p>
  `;
}

async function loadDashboard(forceRefresh = false) {
  if (!token) return;
  if (!forceRefresh && userProfileCache) {
    renderProfile();
    loadNotifications();
    loadManageProjects();
    return;
  }
  const profileContainer = $('#userProfile');
  if (profileContainer) profileContainer.innerHTML = `<p class="muted">${I18N[lang].loading}</p>`;

  const profilePromise = (async () => {
    try {
      const profileRes = await fetch(`${API}/api/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profileData = await profileRes.json();
      if (!profileData.ok) {
        if (profileContainer) profileContainer.innerHTML = `<p class="muted">${escapeHtml(profileData.error || I18N[lang].profile_error)}</p>`;
        return;
      }
      userProfileCache = profileData.user;
      renderProfile();
    } catch (err) {
      console.error(err);
      if (profileContainer) profileContainer.innerHTML = `<p class="muted">${I18N[lang].toast_error}</p>`;
    }
  })();

  const notificationsPromise = loadNotifications(forceRefresh);
  const manageProjectsPromise = loadManageProjects(forceRefresh);

  await Promise.all([profilePromise, notificationsPromise, manageProjectsPromise]);
}

function renderNotifications() {
  const list = $('#notificationList');
  if (!list) return;
  const i18n = I18N[lang];
  list.innerHTML = allNotifications.length === 0 
    ? `<p class="muted">${i18n.notif_empty}</p>`
    : allNotifications.map(n => {
        let title, message;
        const videoTitle = (lang === 'vi' && n.videoTitleVi) ? n.videoTitleVi : n.videoTitle;
        if (n.type === 'comment') {
          title = i18n.notif_comment_title;
          message = i18n.notif_comment_message.replace('{count}', n.count || 1).replace('{title}', videoTitle || '');
        } else if (n.type === 'rating') {
          title = i18n.notif_rating_title;
          message = i18n.notif_rating_message.replace('{count}', n.count || 1).replace('{title}', videoTitle || '');
        } else if (n.type === 'success') {
          title = i18n.notif_success_title;
          message = i18n.notif_success_message.replace('{title}', videoTitle || n.title || '');
        } else {
          title = (lang === 'vi' && n.titleVi) ? n.titleVi : n.title;
          message = (lang === 'vi' && n.messageVi) ? n.messageVi : n.message;
        }
        return `
          <div class="notification-item ${n.isRead ? 'read' : 'unread'}">
            <strong>${escapeHtml(title)}</strong>
            <p>${escapeHtml(message)}</p>
            <div class="muted small">${new Date(n.createdAt).toLocaleString()}</div>
          </div>
        `;
      }).join('');
}

async function loadNotifications(forceRefresh = false) {
  if (!forceRefresh && allNotifications.length > 0) {
    renderNotifications();
    return;
  }
  const container = $('#notificationList');
  if (container) container.innerHTML = `<p class="muted">${I18N[lang].loading}</p>`;
  try {
    const res = await fetch(`${API}/api/notifications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.ok) {
      allNotifications = data.notifications;
      renderNotifications();
    }
  } catch (err) { console.error(err); }
}

function renderManageProjects() {
  const container = $('#manageProjectList');
  if (!container) return;
  if (allManageProjects.length === 0) {
    container.innerHTML = `<p class="muted">${I18N[lang].manage_no_projects}</p>`;
    return;
  }
  container.innerHTML = `<div class="table-wrapper"><table class="manage-table">
    <thead><tr>
      <th>${I18N[lang].manage_id}</th>
      <th>${I18N[lang].manage_title}</th>
      <th>${I18N[lang].manage_category}</th>
      <th>${I18N[lang].manage_actions}</th>
    </tr></thead>
    <tbody>${allManageProjects.map(v => {
      const displayTitle = (lang === 'vi' && v.titleVi) ? v.titleVi : v.title;
      const displayCat = getDisplayCategory(v.category);
      return `
      <tr>
        <td>${v.id}</td>
        <td>${escapeHtml(displayTitle)}</td>
        <td>${escapeHtml(displayCat)}</td>
        <td class="actions-cell">
          <button class="btn small" onclick="openEditModal(${JSON.stringify(v).replace(/"/g, '&quot;')})">${I18N[lang].manage_edit}</button>
          <button class="btn small danger" onclick="deleteProject(${v.id})">${I18N[lang].manage_delete}</button>
        </td>
      </tr>
    `; }).join('')}</tbody>
  </table></div>`;
}

async function loadManageProjects(forceRefresh = false) {
  if (!forceRefresh && allManageProjects.length > 0) {
    renderManageProjects();
    return;
  }
  const container = $('#manageProjectList');
  container.innerHTML = `<p class="muted">${I18N[lang].loading}</p>`;
  try {
    const res = await fetch(`${API}/api/videos/manage`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.ok) {
      container.innerHTML = `<p class="muted">${escapeHtml(data.error || I18N[lang].toast_error)}</p>`;
      return;
    }
    allManageProjects = data.videos;
    renderManageProjects();
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="muted">${I18N[lang].toast_error}</p>`;
  }
}

function openEditModal(video) {
  const modal = $('#editModal');
  $('input[name="editVideoId"]').value = video.id;
  
  // Populate bilingual data attributes
  const bilingualFields = {
    title: { en: video.title || '', vi: video.titleVi || '' },
    description: { en: video.description || '', vi: video.descriptionVi || '' },
    category: { en: video.category || '', vi: video.categoryVi || '' },
    topic: { en: video.topic || '', vi: video.topicVi || '' },
    seriesTitle: { en: video.seriesTitle || '', vi: video.seriesTitleVi || '' },
    explanation: { en: video.explanationContent || video.explanation || '', vi: video.explanationViContent || video.explanationVi || '' }
  };
  
  Object.entries(bilingualFields).forEach(([key, val]) => {
    const id = 'edit' + key.charAt(0).toUpperCase() + key.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.dataset.en = val.en;
      el.dataset.vi = val.vi;
    }
  });
  
  // Part number (monolingual)
  $('#editPartNumber').value = video.partNumber || '';
  
  // Image management
  editImages = video.imageUrls ? [...video.imageUrls] : [];
  renderEditImages();

  // Affiliate Links management
  const editAffiliateRowContainer = $('#editAffiliateRowContainer');
  const editAffiliateLinksRawInput = $('#editAffiliateLinksRaw');
  if (editAffiliateRowContainer && editAffiliateLinksRawInput) {
    editAffiliateRowContainer.innerHTML = '';
    if (video.affiliateLinks && video.affiliateLinks.length > 0) {
      video.affiliateLinks.forEach(link => {
        const name = link.name || link.label || '';
        const url = link.url || (link.links && link.links[0]?.url) || '';
        editAffiliateRowContainer.appendChild(createAffiliateRow(editAffiliateRowContainer, editAffiliateLinksRawInput, name, url));
      });
    }
    serializeAffiliateLinks(editAffiliateRowContainer, editAffiliateLinksRawInput);
  }

  // Set editLang to current global lang
  editLang = lang;
  loadEditFields();
  updateEditLangBadge();
  
  // Reset preview
  $('#editPreviewArea').style.display = 'none';
  $('#editPreviewContent').innerHTML = '';
  
  modal.style.display = 'flex';
}

function loadEditFields() {
  const fields = ['title', 'description', 'category', 'topic', 'seriesTitle', 'explanation'];
  fields.forEach(key => {
    const id = 'edit' + key.charAt(0).toUpperCase() + key.slice(1);
    const el = document.getElementById(id);
    if (el) el.value = el.dataset[editLang] || '';
  });
  syncEditHiddenInputs();
}

function syncEditFields() {
  const fields = ['title', 'description', 'category', 'topic', 'seriesTitle', 'explanation'];
  fields.forEach(key => {
    const id = 'edit' + key.charAt(0).toUpperCase() + key.slice(1);
    const el = document.getElementById(id);
    if (el) el.dataset[editLang] = el.value;
  });
}

function syncEditHiddenInputs() {
  const fields = [
    { key: 'title', en: 'editTitleEn', vi: 'editTitleVi' },
    { key: 'description', en: 'editDescEn', vi: 'editDescVi' },
    { key: 'category', en: 'editCatEn', vi: 'editCatVi' },
    { key: 'topic', en: 'editTopicEn', vi: 'editTopicVi' },
    { key: 'seriesTitle', en: 'editSeriesEn', vi: 'editSeriesVi' },
    { key: 'explanation', en: 'editTexEn', vi: 'editTexVi' }
  ];
  fields.forEach(f => {
    const el = document.getElementById(f.key === 'title' ? 'editTitle' : 'edit' + f.key.charAt(0).toUpperCase() + f.key.slice(1));
    if (el) {
      document.getElementById(f.en).value = el.dataset.en || '';
      document.getElementById(f.vi).value = el.dataset.vi || '';
    }
  });
  const urlsInput = $('#editImageUrls');
  if (urlsInput) urlsInput.value = JSON.stringify(editImages);
}

function updateEditLangBadge() {
  const badge = $('#editLangBadge');
  if (badge) badge.textContent = editLang.toUpperCase();
}

async function autoTranslateEditFields() {
  const fields = ['title', 'description', 'category', 'topic', 'seriesTitle', 'explanation'];
  const missing = fields.filter(key => {
    const id = 'edit' + key.charAt(0).toUpperCase() + key.slice(1);
    const el = document.getElementById(id);
    return el && !el.dataset[editLang]?.trim();
  });
  if (missing.length === 0) return;

  syncEditFields();
  const payload = {};
  fields.forEach(key => {
    const id = 'edit' + key.charAt(0).toUpperCase() + key.slice(1);
    const el = document.getElementById(id);
    if (el) {
      payload[key] = el.dataset.en || '';
      payload[key + 'Vi'] = el.dataset.vi || '';
    }
  });

  try {
    const res = await fetch(`${API}/api/ai/translate-fields`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.ok) {
      fields.forEach(key => {
        const enVal = data.fields[key] !== undefined ? data.fields[key] : payload[key];
        const viVal = data.fields[key + 'Vi'] !== undefined ? data.fields[key + 'Vi'] : payload[key + 'Vi'];
        const id = 'edit' + key.charAt(0).toUpperCase() + key.slice(1);
        const el = document.getElementById(id);
        if (el) {
          el.dataset.en = enVal || '';
          el.dataset.vi = viVal || '';
        }
      });
      loadEditFields();
    }
  } catch (err) {
    console.error('Auto-translate failed:', err);
  }
}

function renderEditImages() {
  const container = $('#editImageList');
  if (!container) return;
  if (editImages.length === 0) {
    container.innerHTML = `<p class="muted">${I18N[lang].edit_no_images}</p>`;
    return;
  }
  container.innerHTML = editImages.map((url, i) =>
    `<div class="gallery-item has-delete">
      <img src="${escapeHtml(proxyImageUrl(url))}" alt="Image ${i + 1}" loading="lazy" />
      <button type="button" class="delete-img" data-index="${i}" title="${I18N[lang].edit_delete_image}">×</button>
    </div>`
  ).join('');
}

function addImageUrl() {
  const input = $('#editImageUrlInput');
  if (!input) return;
  let url = input.value.trim();
  if (!url) return;
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
    showToast('Please enter a valid URL (http://, https://, or /path)');
    return;
  }
  editImages.push(url);
  input.value = '';
  renderEditImages();
}

function setupEditImageHandlers() {
  const addBtn = $('#addImageUrlBtn');
  const urlInput = $('#editImageUrlInput');
  if (addBtn && urlInput) {
    addBtn.addEventListener('click', addImageUrl);
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addImageUrl();
      }
    });
  }
  const list = $('#editImageList');
  if (list) {
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.delete-img');
      if (btn) {
        const idx = parseInt(btn.dataset.index, 10);
        if (!isNaN(idx) && idx < editImages.length) {
          editImages.splice(idx, 1);
          renderEditImages();
        }
      }
    });
  }
}

async function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;
  try {
    const res = await fetch(`${API}/api/videos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.ok) {
      showToast('Project deleted');
      loadManageProjects(true);
    } else {
      showToast(data.error || 'Failed to delete');
    }
  } catch (err) {
    console.error(err);
    showToast(I18N[lang].toast_error);
  }
}

function createAffiliateRow(container, rawInput, name = '', url = '') {
  const row = document.createElement('div');
  row.className = 'affiliate-input-row';
  row.style.display = 'flex';
  row.style.gap = '0.5rem';
  row.style.marginBottom = '0.5rem';
  row.innerHTML = `
    <input type="text" placeholder="${lang === 'vi' ? 'Tên sản phẩm' : 'Product name'}" class="aff-name" value="${escapeHtml(name)}" style="flex: 1;" />
    <input type="url" placeholder="URL" class="aff-url" value="${escapeHtml(url)}" style="flex: 2;" />
    <button type="button" class="btn small danger remove-aff-row">×</button>
  `;
  row.querySelector('.remove-aff-row').onclick = () => {
    row.remove();
    serializeAffiliateLinks(container, rawInput);
  };
  row.querySelectorAll('input').forEach(input => {
    input.oninput = () => serializeAffiliateLinks(container, rawInput);
  });
  return row;
}

function serializeAffiliateLinks(container, rawInput) {
  if (!container || !rawInput) return;
  const rows = container.querySelectorAll('.affiliate-input-row');
  const links = Array.from(rows).map(row => {
    const name = row.querySelector('.aff-name').value.trim();
    const url = row.querySelector('.aff-url').value.trim();
    if (name && url) return `${name} | ${url}`;
    return null;
  }).filter(Boolean);
  rawInput.value = links.join('\n');
}

async function init() {
  theme = localStorage.getItem('theme') || 'light';
  lang = localStorage.getItem('lang') || 'en';
  applyTheme();
  applyLang();
  try {
    await renderVideoGrid();
    populateManualCategoryTopic();
    renderFeaturedFromCache();
    populateCategories();
    populateTopics();
    // Background preload all remaining videos into cache (now lightweight)
    fetchVideos({ limit: 0 }).then(all => {
      if (all && all.length) {
        allVideos = all;
        totalVideos = all.length;
        // Update UI caches that depend on full data
        populateCategories();
        populateTopics();
        populateManualCategoryTopic();
        renderFeaturedFromCache();
      }
    }).catch(() => {});
    if (token) {
      loadDashboard(true);
    }
    // Background preload updates
    loadUpdates().catch(() => {});
  } catch (err) { console.error(err); showToast(I18N[lang].toast_error); }

  $('#themeToggle')?.addEventListener('click', () => { theme = theme === 'dark' ? 'light' : 'dark'; applyTheme(); });
  $('#langToggle')?.addEventListener('click', async () => {
    const editModalOpen = $('#editModal').style.display === 'flex';
    if (editModalOpen) syncEditFields();
    
    lang = lang === 'en' ? 'vi' : 'en';
    editLang = lang;
    applyLang();
    
    if (editModalOpen) {
      loadEditFields();
      updateEditLangBadge();
      await autoTranslateEditFields();
    }
    
    // Re-render from cache only — NO API calls
    renderFeaturedFromCache();
    populateCategories();
    populateTopics();
    populateManualCategoryTopic();
    renderVideoGridFromCache();
    if (selectedVideoId && $('#page-detail').classList.contains('active')) {
      const cachedVideo = allVideos.find(v => v.id === selectedVideoId);
      if (cachedVideo) openDetail(selectedVideoId);
    }
    if ($('#page-updates').classList.contains('active')) renderUpdates(allUpdates);
    if ($('#page-dashboard').classList.contains('active')) {
      renderProfile();
      renderNotifications();
      renderManageProjects();
    }
  });
  $('#mainNav')?.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-page]');
    if (!a) return;
    e.preventDefault();
    const page = a.getAttribute('data-page');
    if (page === 'updates') loadUpdates();
    navigate(page);
  });
  document.querySelectorAll('[data-jump]').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); navigate(btn.getAttribute('data-jump')); });
  });
  $('#searchInput')?.addEventListener('input', debounce(renderVideoGrid, 280));
  $('#categoryFilter')?.addEventListener('change', renderVideoGrid);
  $('#topicFilter')?.addEventListener('change', renderVideoGrid);
  $('#sortFilter')?.addEventListener('change', renderVideoGrid);
  $('#loadMoreBtn')?.addEventListener('click', loadMore);
  $('#backBtn')?.addEventListener('click', () => navigate('videos'));
  $('#feedbackForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = { name: fd.get('name'), email: fd.get('email'), message: fd.get('message') };
    try {
      const res = await fetch(`${API}/api/feedback`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      showToast(I18N[lang].toast_sent);
      e.target.reset();
    } catch { showToast(I18N[lang].toast_error); }
  });
  $('#navToggle')?.addEventListener('click', () => { $('#mainNav').classList.toggle('open'); });

  // Auth Modals
  $('#loginBtn')?.addEventListener('click', () => { $('#loginModal').classList.add('show'); });
  $('#toRegister')?.addEventListener('click', (e) => { e.preventDefault(); $('#loginModal').classList.remove('show'); $('#registerModal').classList.add('show'); });
  $('#toLogin')?.addEventListener('click', (e) => { e.preventDefault(); $('#registerModal').classList.remove('show'); $('#loginModal').classList.add('show'); });
  
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) e.target.classList.remove('show');
  });

  $('#loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fd))
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      token = data.token;
      currentUser = data.user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(currentUser));
      resetInactivityTimer();
      updateAuthUI();
      loadDashboard(true);
      $('#loginModal').classList.remove('show');
      showToast(I18N[lang].toast_login_success);
    } catch (err) { showToast(err.message || I18N[lang].toast_error); }
  });

  $('#registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fd))
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      $('#registerModal').classList.remove('show');
      $('#loginModal').classList.add('show');
      showToast(I18N[lang].toast_register_success);
    } catch (err) { showToast(err.message || I18N[lang].toast_error); }
  });

  $('#previewEditBtn')?.addEventListener('click', () => {
    syncEditFields();
    const texEl = $('#editExplanation');
    const tex = texEl ? texEl.dataset[editLang] || '' : '';
    const previewArea = $('#editPreviewArea');
    const previewContent = $('#editPreviewContent');
    
    previewArea.style.display = 'block';
    previewContent.innerHTML = `<p class="muted">${I18N[lang].loading}</p>`;
    
    // Parse LaTeX logic (reusing part of openDetail)
    let html = tex
      .replace(/\\section\*?\{([^}]*)\}/g, '<h2>$1</h2>')
      .replace(/\\subsection\*?\{([^}]*)\}/g, '<h3>$1</h3>')
      .replace(/\\textbf\{([^}]*)\}/g, '<b>$1</b>')
      .replace(/\\textit\{([^}]*)\}/g, '<i>$1</i>')
      .replace(/\\includegraphics\s*(\[[^\]]*\])?\s*\{([^}]*)\}/g, (match, options, path) => {
        const trimmedPath = path.replace(/\s+/g, '');
        let caption = options ? options.slice(1, -1).trim() : I18N[lang].diagram_caption;
        return `<figure class="diagram-figure mathjax_ignore"><img src="${proxyImageUrl(trimmedPath)}" alt="${escapeHtml(caption)}" style="max-width:100%; border-radius:8px;"></figure>`;
      })
      .replace(/\\begin\{itemize\}/g, '<ul style="margin-left:1.5rem;">')
      .replace(/\\end\{itemize\}/g, '</ul>')
      .replace(/\\begin\{enumerate\}/g, '<ol style="margin-left:1.5rem;">')
      .replace(/\\end\{enumerate\}/g, '</ol>')
      .replace(/\\\{/g, '{')
      .replace(/\\\}/g, '}')
      .replace(/\\item/g, '<li>');

    // Replace placeholders with first uploaded image in preview
    if (editImages.length > 0) {
      const firstUrl = editImages[0];
      const imgTag = `<figure class="diagram-figure mathjax_ignore"><img src="${proxyImageUrl(firstUrl)}" alt="Diagram" style="max-width:100%; border-radius:8px;"></figure>`;
      html = html
        .replace(/\{?\s*\\?textit\s*\{[^}]*Replace with your own diagram[^}]*\}\s*\}?/gi, imgTag)
        .replace(/\{?\s*\\?textit\s*\{[^}]*Thay thế bằng hình ảnh của bạn[^}]*\}\s*\}?/gi, imgTag);
    }

    previewContent.innerHTML = html;
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([previewContent]).catch(e => console.error(e));
    }
  });

  $('#editForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    syncEditFields();

    // Auto-replace diagram placeholders with first uploaded image
    if (editImages.length > 0) {
      const firstUrl = editImages[0];
      const enInput = $('#editExplanation');
      if (enInput) {
        const enRe = /\{\s*\\textit\s*\{[^}]*Replace with your own diagram[^}]*\}\s*\}/gi;
        const viRe = /\{\s*\\textit\s*\{[^}]*Thay thế bằng hình ảnh của bạn[^}]*\}\s*\}/gi;
        const replacement = `\\includegraphics[Diagram]{${firstUrl}}`;
        enInput.dataset.en = enInput.dataset.en.replace(enRe, replacement);
        enInput.dataset.vi = enInput.dataset.vi.replace(viRe, replacement);
      }
    }

    syncEditHiddenInputs();
    const fd = new FormData(e.target);
    const id = fd.get('editVideoId');
    const rawData = Object.fromEntries(fd);
    // Also send explanationRaw/explanationViRaw for compatibility
    rawData.explanationRaw = rawData.explanation;
    rawData.explanationViRaw = rawData.explanationVi;
    // Parse imageUrls back to array
    if (typeof rawData.imageUrls === 'string') {
      try { rawData.imageUrls = JSON.parse(rawData.imageUrls); } catch { rawData.imageUrls = []; }
    }
    try {
      const res = await fetch(`${API}/api/videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(rawData)
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      $('#editModal').style.display = 'none';
      showToast(I18N[lang].toast_update_success);
      // Update local cache only — no full re-fetch
      try {
        const updRes = await fetch(`${API}/api/videos/manage`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const updData = await updRes.json();
        if (updData.ok && updData.videos) {
          const upd = updData.videos.find(v => v.id == id);
          if (upd) {
            const idx = allVideos.findIndex(v => v.id == id);
            if (idx >= 0) allVideos[idx] = upd;
            const idx2 = displayedVideos.findIndex(v => v.id == id);
            if (idx2 >= 0) displayedVideos[idx2] = upd;
          }
        }
      } catch (_) {}
      loadManageProjects();
      renderVideoGridFromCache();
      if (selectedVideoId) openDetail(selectedVideoId);
    } catch (err) { showToast(err.message || I18N[lang].toast_error); }
  });

  $('#cancelEditBtn')?.addEventListener('click', () => {
    $('#editModal').style.display = 'none';
  });

  setupEditImageHandlers();

  $('#logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (inactivityTimer) clearTimeout(inactivityTimer);
    token = null;
    currentUser = null;
    allNotifications = [];
    userProfileCache = null;
    allManageProjects = [];
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateAuthUI();
    navigate('home');
  });

  // Forgot/Reset Toggle Logic
  const loginForm = $('#loginForm');
  const forgotForm = $('#forgotForm');
  const resetForm = $('#resetForm');

  $('#toForgot')?.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    forgotForm.style.display = 'block';
  });

  document.querySelectorAll('.to-login-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      forgotForm.style.display = 'none';
      resetForm.style.display = 'none';
      loginForm.style.display = 'block';
    });
  });

  $('#forgotForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fd))
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      showToast(I18N[lang].toast_forgot_success);
      forgotForm.style.display = 'none';
      resetForm.style.display = 'block';
    } catch (err) { showToast(err.message || I18N[lang].toast_error); }
  });

  $('#resetForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fd))
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      showToast(I18N[lang].toast_reset_success);
      resetForm.style.display = 'none';
      loginForm.style.display = 'block';
    } catch (err) { showToast(err.message || I18N[lang].toast_error); }
  });

  function showSuggestImages(videoId) {
    const video = allVideos.find(v => v.id === videoId);
    if (!video) return;
    const el = document.getElementById('suggestDialog');
    if (el) el.remove();
    const overlay = document.createElement('div');
    overlay.id = 'suggestDialog';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;';
    const box = document.createElement('div');
    box.style.cssText = 'background:var(--surface);border-radius:12px;padding:2rem;max-width:440px;width:90%;box-shadow:var(--shadow);text-align:center;';
    box.innerHTML = `
      <h3 style="margin:0 0 0.75rem">${I18N[lang].suggest_title}</h3>
      <p style="color:var(--muted);line-height:1.5;margin:0 0 1.25rem">${I18N[lang].suggest_body}</p>
      <div style="display:flex;gap:0.75rem;justify-content:center">
        <button class="btn" id="suggestSkip" style="background:var(--bg);color:var(--text)">${I18N[lang].suggest_btn_skip}</button>
        <button class="btn" id="suggestAddImages" style="background:var(--primary);color:#fff">${I18N[lang].suggest_btn_add}</button>
      </div>`;
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    document.getElementById('suggestSkip').onclick = () => overlay.remove();
    document.getElementById('suggestAddImages').onclick = () => { overlay.remove(); openEditModal(video); };
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  }

  const affiliateRowContainer = $('#affiliateRowContainer');
  const editAffiliateRowContainer = $('#editAffiliateRowContainer');
  const addAffiliateRowBtn = $('#addAffiliateRowBtn');
  const editAddAffiliateRowBtn = $('#editAddAffiliateRowBtn');
  const affiliateLinksRawInput = $('#affiliateLinksRaw');
  const editAffiliateLinksRawInput = $('#editAffiliateLinksRaw');

  addAffiliateRowBtn?.addEventListener('click', () => {
    affiliateRowContainer.appendChild(createAffiliateRow(affiliateRowContainer, affiliateLinksRawInput));
  });

  editAddAffiliateRowBtn?.addEventListener('click', () => {
    editAffiliateRowContainer.appendChild(createAffiliateRow(editAffiliateRowContainer, editAffiliateLinksRawInput));
  });

  $('#aiAddForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    serializeAffiliateLinks(affiliateRowContainer, affiliateLinksRawInput);
    const fd = new FormData(e.target);
    const mode = fd.get('submissionMode');
    const submitBtn = $('#submitBtn');
    const overlay = $('#loadingOverlay');
    const loadingText = $('#loadingText');
    const controller = new AbortController();
    const TIMEOUT_MS = 25000;

    submitBtn.disabled = true;

    // Manual mode — synchronous
    overlay.style.display = 'flex';
    loadingText.textContent = I18N[lang].loading;

    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(`${API}/api/ai/add-content`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(Object.fromEntries(fd)),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      e.target.reset();
      affiliateRowContainer.innerHTML = ''; // Clear rows after success
      serializeAffiliateLinks();
      overlay.style.display = 'none';
      submitBtn.disabled = false;
      showToast(I18N[lang].toast_manual_success);
      loadNotifications(true);
      // Update local cache with fresh first page — no full re-fetch
      try {
        const freshRes = await fetch(`${API}/api/videos?limit=12&offset=0`);
        const freshData = await freshRes.json();
        if (freshData.ok) {
          allVideos = freshData.videos;
          displayedVideos = freshData.videos;
          totalVideos = freshData.total;
          renderVideoGridFromCache();
        }
      } catch (_) { await renderVideoGrid(); }
      navigate('videos');
      if (mode === 'ai' && data.videoId) setTimeout(() => showSuggestImages(data.videoId), 800);
    } catch (err) {
      overlay.style.display = 'none';
      submitBtn.disabled = false;
      if (err.name === 'AbortError') {
        showToast(lang === 'vi' ? 'Máy chủ quá tải hoặc hết thời gian. Vui lòng thử lại sau.' : 'Server timeout. Please try again later.');
      } else {
        showToast(err.message || I18N[lang].toast_error);
      }
    }
  });

  const modeAiBtn = $('#modeAiBtn');
  const modeManualBtn = $('#modeManualBtn');
  const manualFields = $('#manualFields');
  const submissionModeInput = $('#submissionMode');
  const submitBtn = $('#submitBtn');
  modeAiBtn?.addEventListener('click', () => {
    modeAiBtn.classList.add('active');
    modeManualBtn.classList.remove('active');
    manualFields.style.display = 'none';
    submissionModeInput.value = 'ai';
    submitBtn.textContent = I18N[lang].ai_submit;
    submitBtn.setAttribute('data-i18n', 'ai_submit');
  });
  modeManualBtn?.addEventListener('click', () => {
    modeManualBtn.classList.add('active');
    modeAiBtn.classList.remove('active');
    manualFields.style.display = 'block';
    submissionModeInput.value = 'manual';
    submitBtn.textContent = I18N[lang].post_now;
    submitBtn.setAttribute('data-i18n', 'post_now');
  });
  updateAuthUI();
  if (token) resetInactivityTimer();
  $('#navDashboard')?.addEventListener('click', (e) => {
    e.preventDefault();
    loadDashboard();
    navigate('dashboard');
  });
  $('#changePasswordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const res = await fetch(`${API}/api/users/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(Object.fromEntries(fd))
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      e.target.reset();
      showToast(I18N[lang].toast_password_success);
    } catch (err) { showToast(err.message || I18N[lang].toast_error); }
  });
  $('#changeEmailForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const res = await fetch(`${API}/api/users/change-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(Object.fromEntries(fd))
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      if (inactivityTimer) clearTimeout(inactivityTimer);
      token = null; currentUser = null;
      localStorage.removeItem('token'); localStorage.removeItem('user');
      updateAuthUI(); navigate('home');
      showToast(I18N[lang].toast_email_success);
    } catch (err) { showToast(err.message || I18N[lang].toast_error); }
  });
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.password-toggle');
  if (!btn) return;
  const input = btn.parentElement.querySelector('input');
  const isPW = input.type === 'password';
  input.type = isPW ? 'text' : 'password';
  btn.textContent = isPW ? '🙈' : '👁️';
});

document.addEventListener('click', async e => {
  const btn = e.target.closest('.comment-status');
  if (!btn) return;
  const id = btn.dataset.id;
  const isRead = btn.dataset.read === 'true';
  const list = btn.closest('#commentList');
  if (!list) return;
  try {
    const r = await fetch(`${API}/api/comments/${id}/toggle-read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    if (r.ok) await loadComments(list.dataset.videoId);
  } catch { /* ignore */ }
});

document.addEventListener('DOMContentLoaded', init);
