# Database Schema - Hệ thống Việc Làm IT

## Cấu trúc các bảng trong database

### Bảng Users và Authentication
```
users(user_id, username, email, password_hash, role, phone, full_name, avatar_url, is_verified, is_active, created_at, updated_at)
user_verifications(verification_id, user_id, verification_type, verification_code, expires_at, is_used, created_at)
```

### Bảng Ứng viên (Candidates)
```
candidates(candidate_id, user_id, date_of_birth, gender, address, city, education_level, experience_years, skills, bio, cv_url, linkedin_url, github_url, portfolio_url, salary_expectation, job_status, created_at, updated_at)
candidate_experiences(experience_id, candidate_id, company_name, position, start_date, end_date, description, is_current)
candidate_educations(education_id, candidate_id, school_name, degree, major, start_date, end_date, gpa, description)
candidate_skills(skill_id, candidate_id, skill_name, skill_level, years_of_experience)
```

### Bảng Nhà tuyển dụng (Recruiters)
```
recruiters(recruiter_id, user_id, company_name, company_description, company_size, industry, website, tax_id, company_address, company_logo_url, is_verified, subscription_plan, plan_expires_at, created_at, updated_at)
recruiter_subscriptions(subscription_id, recruiter_id, plan_type, start_date, end_date, price, payment_status, features)
```

### Bảng Công việc (Jobs)
```
jobs(job_id, recruiter_id, title, description, requirements, benefits, salary_min, salary_max, job_type, work_location, experience_required, education_required, skills_required, application_deadline, is_active, is_featured, views_count, applications_count, created_at, updated_at)
job_categories(category_id, category_name, description, parent_category_id)
job_category_mapping(job_id, category_id)
job_skills(job_skill_id, job_id, skill_name, is_required, weight)
```

### Bảng Ứng tuyển (Applications)
```
applications(application_id, job_id, candidate_id, cover_letter, cv_url, application_status, applied_at, reviewed_at, interviewer_notes, salary_offered, rejection_reason)
application_status_history(history_id, application_id, old_status, new_status, changed_by, change_reason, changed_at)
```

### Bảng Phỏng vấn (Interviews)
```
interviews(interview_id, application_id, recruiter_id, candidate_id, interview_type, interview_date, interview_time, duration_minutes, location, meeting_link, notes, status, created_at, updated_at)
interview_feedback(feedback_id, interview_id, interviewer_id, candidate_rating, technical_skills_rating, communication_rating, cultural_fit_rating, comments, recommendation)
```

### Bảng AI và Gợi ý (AI Recommendations)
```
ai_job_recommendations(recommendation_id, candidate_id, job_id, score, algorithm_version, reasons, created_at, is_viewed, is_applied)
ai_candidate_recommendations(recommendation_id, recruiter_id, candidate_id, job_id, score, algorithm_version, reasons, created_at, is_viewed, is_contacted)
ai_user_preferences(preference_id, user_id, preference_type, preference_data, weight, created_at, updated_at)
ai_feedback(feedback_id, user_id, recommendation_type, recommendation_id, feedback_type, rating, comments, created_at)
```

### Bảng Thông báo và Tin nhắn (Notifications & Messages)
```
notifications(notification_id, user_id, title, message, notification_type, is_read, related_entity_type, related_entity_id, created_at)
messages(message_id, sender_id, receiver_id, subject, content, is_read, message_type, related_application_id, sent_at)
email_templates(template_id, template_name, subject, content, template_type, is_active, created_at, updated_at)
```

### Bảng Báo cáo và Vi phạm (Reports)
```
reports(report_id, reporter_id, reported_entity_type, reported_entity_id, report_type, reason, description, status, admin_notes, created_at, resolved_at, resolved_by)
violation_types(violation_type_id, name, description, severity_level)
```

### Bảng Quản trị (Admin)
```
admins(admin_id, user_id, admin_level, permissions, created_at, updated_at)
admin_actions(action_id, admin_id, action_type, target_entity_type, target_entity_id, description, created_at)
system_settings(setting_id, setting_key, setting_value, description, updated_by, updated_at)
```

### Bảng Thống kê (Statistics)
```
user_activities(activity_id, user_id, activity_type, entity_type, entity_id, ip_address, user_agent, created_at)
job_views(view_id, job_id, user_id, ip_address, viewed_at)
search_logs(search_id, user_id, search_query, search_filters, results_count, searched_at)
system_statistics(stat_id, metric_name, metric_value, period_type, period_date, calculated_at)
```

### Bảng Thanh toán (Payments)
```
payments(payment_id, recruiter_id, subscription_id, amount, currency, payment_method, payment_status, transaction_id, gateway_response, created_at, processed_at)
payment_methods(method_id, method_name, is_active, configuration)
invoices(invoice_id, recruiter_id, payment_id, invoice_number, amount, tax_amount, total_amount, issue_date, due_date, status)
```

### Bảng Hệ thống (System)
```
file_uploads(file_id, user_id, file_name, file_path, file_size, file_type, upload_purpose, is_temporary, created_at, expires_at)
audit_logs(log_id, user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent, created_at)
email_queue(queue_id, recipient_email, subject, content, template_id, status, attempts, last_attempt_at, created_at, sent_at)
```