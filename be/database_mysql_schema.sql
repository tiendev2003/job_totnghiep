-- ============================================
-- HỆ THỐNG TUYỂN DỤNG - MYSQL DATABASE SCHEMA
-- Converted from MongoDB Models
-- Created: October 3, 2025
-- ============================================

-- Xóa database nếu tồn tại và tạo mới
DROP DATABASE IF EXISTS job_recruitment_system;
CREATE DATABASE job_recruitment_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE job_recruitment_system;

-- ============================================
-- PHẦN 1: BẢNG NGƯỜI DÙNG CƠ BẢN
-- ============================================

-- Bảng Users - Quản lý tất cả người dùng
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) DEFAULT NULL,
    google_id VARCHAR(255) DEFAULT NULL UNIQUE,
    provider ENUM('local', 'google') DEFAULT 'local',
    role ENUM('candidate', 'recruiter', 'admin') DEFAULT 'candidate',
    
    -- Thông tin cá nhân
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    avatar_url TEXT DEFAULT NULL,
    
    -- Trạng thái tài khoản
    account_status ENUM('pending', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
    status_reason VARCHAR(500) DEFAULT NULL,
    status_updated_by BIGINT UNSIGNED DEFAULT NULL,
    status_updated_at DATETIME DEFAULT NULL,
    last_login DATETIME DEFAULT NULL,
    
    -- Reset password
    reset_password_token VARCHAR(255) DEFAULT NULL,
    reset_password_expire DATETIME DEFAULT NULL,
    
    -- Email verification
    email_verification_code VARCHAR(10) DEFAULT NULL,
    email_verification_expires_at DATETIME DEFAULT NULL,
    email_verification_attempts TINYINT DEFAULT 0,
    
    -- Phone verification
    phone_verification_code VARCHAR(10) DEFAULT NULL,
    phone_verification_expires_at DATETIME DEFAULT NULL,
    phone_verification_attempts TINYINT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_account_status (account_status),
    INDEX idx_google_id (google_id),
    FOREIGN KEY (status_updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Candidates - Hồ sơ ứng viên
CREATE TABLE candidates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    
    -- Thông tin cá nhân
    date_of_birth DATE DEFAULT NULL,
    gender ENUM('male', 'female', 'other') DEFAULT NULL,
    address VARCHAR(200) DEFAULT NULL,
    city VARCHAR(50) DEFAULT NULL,
    
    -- Thông tin nghề nghiệp
    education_level ENUM('high_school', 'associate', 'bachelor', 'master', 'doctorate', 'other') DEFAULT NULL,
    experience_years TINYINT UNSIGNED DEFAULT 0,
    bio TEXT DEFAULT NULL,
    
    -- Links
    cv_url TEXT DEFAULT NULL,
    linkedin_url VARCHAR(255) DEFAULT NULL,
    github_url VARCHAR(255) DEFAULT NULL,
    portfolio_url VARCHAR(255) DEFAULT NULL,
    
    -- Mức lương mong muốn
    salary_expectation_min DECIMAL(15,2) DEFAULT NULL,
    salary_expectation_max DECIMAL(15,2) DEFAULT NULL,
    salary_expectation_currency ENUM('VND', 'USD', 'EUR') DEFAULT 'VND',
    
    -- Trạng thái
    job_status ENUM('seeking', 'employed', 'not_seeking') DEFAULT 'seeking',
    
    cv_file_url TEXT DEFAULT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_city (city),
    INDEX idx_job_status (job_status),
    INDEX idx_experience_years (experience_years)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Candidate Skills
CREATE TABLE candidate_skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT UNSIGNED NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    INDEX idx_candidate_skill (candidate_id, skill_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Candidate Skills Detailed
CREATE TABLE candidate_skills_detailed (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT UNSIGNED NOT NULL,
    skill_name VARCHAR(50) NOT NULL,
    skill_level ENUM('beginner', 'intermediate', 'advanced', 'expert') NOT NULL,
    years_of_experience TINYINT UNSIGNED DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    INDEX idx_candidate_id (candidate_id),
    INDEX idx_skill_level (skill_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Candidate Education
CREATE TABLE candidate_education (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT UNSIGNED NOT NULL,
    school_name VARCHAR(150) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    major VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE DEFAULT NULL,
    gpa DECIMAL(3,2) DEFAULT NULL,
    description VARCHAR(500) DEFAULT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    INDEX idx_candidate_id (candidate_id),
    INDEX idx_is_current (is_current)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Candidate Experience
CREATE TABLE candidate_experience (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT UNSIGNED NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE DEFAULT NULL,
    description TEXT DEFAULT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    INDEX idx_candidate_id (candidate_id),
    INDEX idx_is_current (is_current)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Candidate Experience Technologies
CREATE TABLE candidate_experience_technologies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    experience_id BIGINT UNSIGNED NOT NULL,
    technology VARCHAR(100) NOT NULL,
    
    FOREIGN KEY (experience_id) REFERENCES candidate_experience(id) ON DELETE CASCADE,
    INDEX idx_experience_id (experience_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Recruiters - Nhà tuyển dụng
CREATE TABLE recruiters (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    
    -- Thông tin công ty
    company_name VARCHAR(100) NOT NULL,
    company_description TEXT DEFAULT NULL,
    company_size ENUM('1-10', '11-50', '51-100', '100-500', '500+') DEFAULT NULL,
    industry VARCHAR(100) DEFAULT NULL,
    website VARCHAR(255) DEFAULT NULL,
    
    -- Thông tin liên hệ công ty
    company_email VARCHAR(255) DEFAULT NULL,
    company_phone VARCHAR(20) DEFAULT NULL,
    company_address VARCHAR(200) DEFAULT NULL,
    founded_year SMALLINT UNSIGNED DEFAULT NULL,
    
    -- Hình ảnh
    logo_url TEXT DEFAULT NULL,
    cover_image_url TEXT DEFAULT NULL,
    
    -- Văn hóa & Giá trị
    mission TEXT DEFAULT NULL,
    vision TEXT DEFAULT NULL,
    company_culture TEXT DEFAULT NULL,
    
    -- Thông tin người liên hệ
    contact_person_name VARCHAR(100) DEFAULT NULL,
    contact_email VARCHAR(255) DEFAULT NULL,
    contact_phone VARCHAR(20) DEFAULT NULL,
    position VARCHAR(100) DEFAULT NULL,
    department VARCHAR(100) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    avatar_url TEXT DEFAULT NULL,
    
    -- Social Links
    social_linkedin VARCHAR(255) DEFAULT NULL,
    social_facebook VARCHAR(255) DEFAULT NULL,
    social_twitter VARCHAR(255) DEFAULT NULL,
    
    -- Legacy/Other
    tax_id VARCHAR(50) DEFAULT NULL UNIQUE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_company_name (company_name),
    INDEX idx_is_verified (is_verified),
    INDEX idx_industry (industry)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Recruiter Benefits
CREATE TABLE recruiter_benefits (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recruiter_id BIGINT UNSIGNED NOT NULL,
    benefit VARCHAR(200) NOT NULL,
    
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE,
    INDEX idx_recruiter_id (recruiter_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Recruiter Company Locations
CREATE TABLE recruiter_locations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recruiter_id BIGINT UNSIGNED NOT NULL,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(200) DEFAULT NULL,
    is_headquarters BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE,
    INDEX idx_recruiter_id (recruiter_id),
    INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Recruiter Skills
CREATE TABLE recruiter_skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recruiter_id BIGINT UNSIGNED NOT NULL,
    skill VARCHAR(50) NOT NULL,
    
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE,
    INDEX idx_recruiter_id (recruiter_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Recruiter Languages
CREATE TABLE recruiter_languages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recruiter_id BIGINT UNSIGNED NOT NULL,
    language VARCHAR(50) NOT NULL,
    
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE,
    INDEX idx_recruiter_id (recruiter_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PHẦN 2: BẢNG CÔNG VIỆC
-- ============================================

-- Bảng Job Categories
CREATE TABLE job_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200) DEFAULT NULL,
    icon VARCHAR(100) DEFAULT NULL,
    color VARCHAR(7) DEFAULT NULL,
    parent_category_id BIGINT UNSIGNED DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    
    -- SEO
    meta_title VARCHAR(60) DEFAULT NULL,
    meta_description VARCHAR(160) DEFAULT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_category_id) REFERENCES job_categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active),
    INDEX idx_parent_category (parent_category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Jobs
CREATE TABLE jobs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recruiter_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED DEFAULT NULL,
    
    -- Thông tin cơ bản
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    company_name VARCHAR(100) DEFAULT NULL,
    
    -- Mức lương
    salary_min DECIMAL(15,2) DEFAULT NULL,
    salary_max DECIMAL(15,2) DEFAULT NULL,
    salary_currency ENUM('VND', 'USD', 'EUR') DEFAULT 'VND',
    
    -- Loại công việc
    job_type ENUM('full_time', 'part_time', 'contract', 'internship', 'freelance') NOT NULL,
    work_location ENUM('onsite', 'remote', 'hybrid') NOT NULL,
    seniority_level ENUM('entry', 'junior', 'mid', 'senior', 'lead', 'executive') DEFAULT 'junior',
    
    -- Số lượng tuyển
    positions_available INT UNSIGNED DEFAULT 1,
    
    -- Địa điểm
    location_address VARCHAR(200) DEFAULT NULL,
    location_city VARCHAR(100) NOT NULL,
    location_country VARCHAR(100) DEFAULT 'Vietnam',
    
    -- Kinh nghiệm & Học vấn
    experience_required_min TINYINT UNSIGNED DEFAULT 0,
    experience_required_max TINYINT UNSIGNED DEFAULT NULL,
    education_required ENUM('high_school', 'associate', 'bachelor', 'master', 'doctorate', 'not_required') DEFAULT 'not_required',
    
    -- Điều kiện làm việc
    working_hours VARCHAR(100) DEFAULT '8:00 - 17:30 (Thứ 2 - Thứ 6)',
    working_model ENUM('onsite', 'remote', 'hybrid') DEFAULT 'onsite',
    probation_period VARCHAR(50) DEFAULT '2 tháng',
    start_date VARCHAR(50) DEFAULT 'Thỏa thuận',
    
    -- Thời hạn & Trạng thái
    application_deadline DATETIME DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    status ENUM('pending', 'approved', 'rejected', 'suspended', 'expired') DEFAULT 'pending',
    
    -- Admin
    admin_notes VARCHAR(500) DEFAULT NULL,
    reviewed_by BIGINT UNSIGNED DEFAULT NULL,
    reviewed_at DATETIME DEFAULT NULL,
    
    -- Đặc biệt
    is_featured BOOLEAN DEFAULT FALSE,
    is_hot BOOLEAN DEFAULT FALSE,
    is_urgent BOOLEAN DEFAULT FALSE,
    
    -- Thống kê
    views_count INT UNSIGNED DEFAULT 0,
    applications_count INT UNSIGNED DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES job_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_recruiter_id (recruiter_id),
    INDEX idx_category_id (category_id),
    INDEX idx_job_type (job_type),
    INDEX idx_work_location (work_location),
    INDEX idx_location_city (location_city),
    INDEX idx_is_active (is_active),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_application_deadline (application_deadline),
    FULLTEXT idx_search (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Job Requirements
CREATE TABLE job_requirements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT UNSIGNED NOT NULL,
    requirement TEXT NOT NULL,
    
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    INDEX idx_job_id (job_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Job Benefits
CREATE TABLE job_benefits (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT UNSIGNED NOT NULL,
    benefit VARCHAR(200) NOT NULL,
    
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    INDEX idx_job_id (job_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Job Skills Required
CREATE TABLE job_skills_required (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT UNSIGNED NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    weight TINYINT UNSIGNED DEFAULT 5,
    
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    INDEX idx_job_id (job_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Job Nice to Have Skills
CREATE TABLE job_nice_to_have_skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT UNSIGNED NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    weight TINYINT UNSIGNED DEFAULT 3,
    
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    INDEX idx_job_id (job_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Job Highlights
CREATE TABLE job_highlights (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT UNSIGNED NOT NULL,
    highlight VARCHAR(200) NOT NULL,
    
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    INDEX idx_job_id (job_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Job Tags
CREATE TABLE job_tags (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT UNSIGNED NOT NULL,
    tag VARCHAR(50) NOT NULL,
    
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    INDEX idx_job_id (job_id),
    INDEX idx_tag (tag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Job Categories (Many-to-Many)
CREATE TABLE job_category_mappings (
    job_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    
    PRIMARY KEY (job_id, category_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES job_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- KẾT THÚC PHẦN 1: CÁC BẢNG CƠ BẢN
-- ============================================
-- Các bảng tiếp theo sẽ được tạo ở file part 2
-- Bao gồm: Applications, Interviews, Payments, Messages, AI, System tables
