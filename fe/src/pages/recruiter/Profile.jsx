import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import recruiterService from '../../services/recruiterService';
import { formatDate } from '../../utils/formatters';

const RecruiterProfile = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);

  const [companyInfo, setCompanyInfo] = useState({
    company_name: '',
    company_description: '',
    industry: '',
    company_size: '',
    website: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    founded_year: '',
    logo_url: '',
    cover_image_url: '',
    social_links: {
      linkedin: '',
      facebook: '',
      twitter: ''
    },
    benefits: [],
    company_culture: '',
    mission: '',
    vision: ''
  });

  const [personalInfo, setPersonalInfo] = useState({
    contact_person_name: '',
    contact_email: '',
    contact_phone: '',
    position: '',
    department: '',
    bio: '',
    avatar_url: '',
    skills: [],
    languages: []
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await recruiterService.getProfile();
      const profileData = response.data;
      
      console.log('Profile data loaded:', profileData); // Debug log
      setProfile(profileData);
      
      // Set company info
      setCompanyInfo({
        company_name: profileData.company_name || '',
        company_description: profileData.company_description || '',
        industry: profileData.industry || '',
        company_size: profileData.company_size || '',
        website: profileData.website || '',
        company_email: profileData.company_email || '',
        company_phone: profileData.company_phone || '',
        company_address: profileData.company_address || '',
        founded_year: profileData.founded_year || '',
        logo_url: profileData.logo_url || '',
        cover_image_url: profileData.cover_image_url || '',
        social_links: profileData.social_links || {
          linkedin: '',
          facebook: '',
          twitter: ''
        },
        benefits: Array.isArray(profileData.benefits) ? profileData.benefits : [],
        company_culture: profileData.company_culture || '',
        mission: profileData.mission || '',
        vision: profileData.vision || ''
      });

      // Set personal info
      setPersonalInfo({
        contact_person_name: profileData.contact_person_name || '',
        contact_email: profileData.contact_email || '',
        contact_phone: profileData.contact_phone || '',
        position: profileData.position || '',
        department: profileData.department || '',
        bio: profileData.bio || '',
        avatar_url: profileData.avatar_url || '',
        skills: Array.isArray(profileData.skills) ? profileData.skills : [],
        languages: Array.isArray(profileData.languages) ? profileData.languages : []
      });

      console.log('Personal info set:', {
        contact_person_name: profileData.contact_person_name || '',
        contact_email: profileData.contact_email || '',
        contact_phone: profileData.contact_phone || '',
        position: profileData.position || '',
        department: profileData.department || '',
        bio: profileData.bio || '',
        avatar_url: profileData.avatar_url || '',
        skills: Array.isArray(profileData.skills) ? profileData.skills : [],
        languages: Array.isArray(profileData.languages) ? profileData.languages : []
      }); // Debug log

    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      
      // Validate required fields
      if (!companyInfo.company_name?.trim()) {
        toast.error('Tên công ty là bắt buộc');
        return;
      }
      
      const profileData = {
        ...companyInfo,
        ...personalInfo,
        // Ensure arrays are properly formatted
        benefits: Array.isArray(companyInfo.benefits) ? companyInfo.benefits.filter(b => b?.trim()) : [],
        skills: Array.isArray(personalInfo.skills) ? personalInfo.skills.filter(s => s?.trim()) : [],
        languages: Array.isArray(personalInfo.languages) ? personalInfo.languages.filter(l => l?.trim()) : [],
        // Ensure social_links object exists
        social_links: {
          linkedin: companyInfo.social_links?.linkedin || '',
          facebook: companyInfo.social_links?.facebook || '',
          twitter: companyInfo.social_links?.twitter || ''
        }
      };
      
      console.log('Saving profile data:', profileData); // Debug log
      
      await recruiterService.updateProfile(profileData);
      toast.success('Cập nhật hồ sơ thành công!');
      await loadProfile(); // Reload to get updated data
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật hồ sơ');
    } finally {
      setSaving(false);
    }
  };

  const [notifications, setNotifications] = useState({
    emailNotifications: {
      newApplications: true,
      interviewReminders: true,
      messageReceived: true,
      subscriptionUpdates: false,
      marketingEmails: false
    },
    pushNotifications: {
      newApplications: true,
      interviewReminders: true,
      messageReceived: false,
      systemUpdates: true
    },
    frequency: 'immediately' // immediately, daily, weekly
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    passwordLastChanged: '2024-01-01',
    activeDevices: [
      { id: 1, name: 'MacBook Pro', location: 'Hà Nội', lastAccess: '2024-01-16 14:30', current: true },
      { id: 2, name: 'iPhone 13', location: 'Hà Nội', lastAccess: '2024-01-16 12:15', current: false },
      { id: 3, name: 'Chrome on Windows', location: 'Hà Nội', lastAccess: '2024-01-15 18:45', current: false }
    ]
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleCompanyUpdate = (field, value) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePersonalUpdate = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationUpdate = (category, field, value) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const addBenefit = () => {
    const newBenefit = prompt('Nhập phúc lợi mới:');
    if (newBenefit && newBenefit.trim()) {
      setCompanyInfo(prev => ({
        ...prev,
        benefits: [...(prev.benefits || []), newBenefit.trim()]
      }));
    }
  };

  const removeBenefit = (index) => {
    setCompanyInfo(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    const newSkill = prompt('Nhập kỹ năng mới:');
    if (newSkill && newSkill.trim()) {
      setPersonalInfo(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()]
      }));
    }
  };

  const removeSkill = (index) => {
    setPersonalInfo(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    const newLanguage = prompt('Nhập ngôn ngữ mới:');
    if (newLanguage && newLanguage.trim()) {
      setPersonalInfo(prev => ({
        ...prev,
        languages: [...(prev.languages || []), newLanguage.trim()]
      }));
    }
  };

  const removeLanguage = (index) => {
    setPersonalInfo(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const tabs = [
    { id: 'company', name: 'Thông tin công ty', icon: '🏢' },
    { id: 'personal', name: 'Thông tin cá nhân', icon: '👤' },
    { id: 'notifications', name: 'Thông báo', icon: '🔔' },
    { id: 'security', name: 'Bảo mật', icon: '🔒' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Hồ sơ của tôi</h1>
        <button 
          onClick={saveProfile}
          disabled={saving}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang lưu...
            </div>
          ) : (
            'Lưu thay đổi'
          )}
        </button>
      </div>

      {/* Profile Summary */}
      {profile && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
              {profile.logo_url || profile.company_logo_url ? (
                <img src={profile.logo_url || profile.company_logo_url} alt="Logo" className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h6m-6 4h10" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profile.company_name || 'Chưa cập nhật tên công ty'}
              </h2>
              <p className="text-gray-600">{profile.industry || 'Chưa cập nhật ngành nghề'}</p>
              <p className="text-sm text-gray-500">
                Tham gia từ {formatDate(profile.created_at)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Company Info Tab */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên công ty</label>
                  <input
                    type="text"
                    value={companyInfo.company_name}
                    onChange={(e) => setCompanyInfo({...companyInfo, company_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngành nghề</label>
                  <select
                    value={companyInfo.industry}
                    onChange={(e) => setCompanyInfo({...companyInfo, industry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Chọn ngành nghề</option>
                    <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                    <option value="Tài chính - Ngân hàng">Tài chính - Ngân hàng</option>
                    <option value="Y tế">Y tế</option>
                    <option value="Giáo dục">Giáo dục</option>
                    <option value="Bán lẻ">Bán lẻ</option>
                    <option value="Sản xuất">Sản xuất</option>
                    <option value="Dịch vụ">Dịch vụ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quy mô công ty</label>
                  <select
                    value={companyInfo.company_size}
                    onChange={(e) => setCompanyInfo({...companyInfo, company_size: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Chọn quy mô</option>
                    <option value="1-10">1-10 nhân viên</option>
                    <option value="11-50">11-50 nhân viên</option>
                    <option value="51-100">51-100 nhân viên</option>
                    <option value="100-500">100-500 nhân viên</option>
                    <option value="500+">500+ nhân viên</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Năm thành lập</label>
                  <input
                    type="number"
                    value={companyInfo.founded_year}
                    onChange={(e) => setCompanyInfo({...companyInfo, founded_year: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={companyInfo.website}
                    onChange={(e) => handleCompanyUpdate('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email công ty</label>
                  <input
                    type="email"
                    value={companyInfo.company_email}
                    onChange={(e) => handleCompanyUpdate('company_email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    value={companyInfo.company_phone}
                    onChange={(e) => handleCompanyUpdate('company_phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                  <input
                    type="text"
                    value={companyInfo.company_address}
                    onChange={(e) => handleCompanyUpdate('company_address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả công ty</label>
                <textarea
                  rows={4}
                  value={companyInfo.company_description}
                  onChange={(e) => handleCompanyUpdate('company_description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sứ mệnh</label>
                  <textarea
                    rows={3}
                    value={companyInfo.mission}
                    onChange={(e) => handleCompanyUpdate('mission', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tầm nhìn</label>
                  <textarea
                    rows={3}
                    value={companyInfo.vision}
                    onChange={(e) => handleCompanyUpdate('vision', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Văn hóa công ty</label>
                <textarea
                  rows={3}
                  value={companyInfo.company_culture}
                  onChange={(e) => handleCompanyUpdate('company_culture', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">Phúc lợi</label>
                  <button
                    onClick={addBenefit}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Thêm phúc lợi
                  </button>
                </div>
                <div className="space-y-2">
                  {(companyInfo.benefits || []).map((benefit, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <span className="text-sm text-gray-700">{benefit}</span>
                      <button
                        onClick={() => removeBenefit(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Mạng xã hội</label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-20 text-sm text-gray-600">LinkedIn:</span>
                    <input
                      type="url"
                      value={companyInfo.social_links?.linkedin || ''}
                      onChange={(e) => setCompanyInfo({...companyInfo, social_links: {...(companyInfo.social_links || {}), linkedin: e.target.value}})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-20 text-sm text-gray-600">Facebook:</span>
                    <input
                      type="url"
                      value={companyInfo.social_links?.facebook || ''}
                      onChange={(e) => setCompanyInfo({...companyInfo, social_links: {...(companyInfo.social_links || {}), facebook: e.target.value}})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-20 text-sm text-gray-600">Twitter:</span>
                    <input
                      type="url"
                      value={companyInfo.social_links?.twitter || ''}
                      onChange={(e) => setCompanyInfo({...companyInfo, social_links: {...(companyInfo.social_links || {}), twitter: e.target.value}})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Debug Info:</h4>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(personalInfo, null, 2)}
                  </pre>
                </div>
              )}
              
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  {personalInfo.avatar_url ? (
                    <img src={personalInfo.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-3xl text-gray-400">👤</span>
                  )}
                </div>
                <div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-3">
                    Tải ảnh lên
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                    Xóa ảnh
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={personalInfo.contact_person_name}
                    onChange={(e) => handlePersonalUpdate('contact_person_name', e.target.value)}
                    placeholder="Nhập họ và tên của bạn"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email liên hệ</label>
                  <input
                    type="email"
                    value={personalInfo.contact_email}
                    onChange={(e) => handlePersonalUpdate('contact_email', e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    value={personalInfo.contact_phone}
                    onChange={(e) => handlePersonalUpdate('contact_phone', e.target.value)}
                    placeholder="0123456789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chức vụ</label>
                  <input
                    type="text"
                    value={personalInfo.position}
                    onChange={(e) => handlePersonalUpdate('position', e.target.value)}
                    placeholder="Ví dụ: HR Manager, Tuyển dụng viên"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phòng ban</label>
                  <input
                    type="text"
                    value={personalInfo.department}
                    onChange={(e) => handlePersonalUpdate('department', e.target.value)}
                    placeholder="Ví dụ: Phòng Nhân sự, Phòng Tuyển dụng"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giới thiệu bản thân</label>
                <textarea
                  rows={4}
                  value={personalInfo.bio}
                  onChange={(e) => handlePersonalUpdate('bio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="Mô tả ngắn về bản thân, kinh nghiệm và sở thích..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(personalInfo.skills || []).map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {skill}
                        <button
                          onClick={() => removeSkill(index)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={addSkill}
                    className="px-3 py-1 border border-dashed border-gray-300 text-gray-600 text-sm rounded-full hover:border-green-500 hover:text-green-600"
                  >
                    + Thêm kỹ năng
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(personalInfo.languages || []).map((language, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {language}
                        <button
                          onClick={() => removeLanguage(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={addLanguage}
                    className="px-3 py-1 border border-dashed border-gray-300 text-gray-600 text-sm rounded-full hover:border-blue-500 hover:text-blue-600"
                  >
                    + Thêm ngôn ngữ
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông báo qua Email</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Đơn ứng tuyển mới</p>
                      <p className="text-sm text-gray-500">Nhận thông báo khi có đơn ứng tuyển mới</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications.newApplications}
                      onChange={(e) => handleNotificationUpdate('emailNotifications', 'newApplications', e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Nhắc nhở phỏng vấn</p>
                      <p className="text-sm text-gray-500">Nhận nhắc nhở trước buổi phỏng vấn</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications.interviewReminders}
                      onChange={(e) => handleNotificationUpdate('emailNotifications', 'interviewReminders', e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Tin nhắn mới</p>
                      <p className="text-sm text-gray-500">Nhận thông báo khi có tin nhắn từ ứng viên</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications.messageReceived}
                      onChange={(e) => handleNotificationUpdate('emailNotifications', 'messageReceived', e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cập nhật gói đăng ký</p>
                      <p className="text-sm text-gray-500">Thông báo về hóa đơn và thay đổi gói</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications.subscriptionUpdates}
                      onChange={(e) => handleNotificationUpdate('emailNotifications', 'subscriptionUpdates', e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email marketing</p>
                      <p className="text-sm text-gray-500">Nhận thông tin về tính năng mới và khuyến mãi</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications.marketingEmails}
                      onChange={(e) => handleNotificationUpdate('emailNotifications', 'marketingEmails', e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông báo đẩy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Đơn ứng tuyển mới</p>
                      <p className="text-sm text-gray-500">Thông báo ngay lập tức trên trình duyệt</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.pushNotifications.newApplications}
                      onChange={(e) => handleNotificationUpdate('pushNotifications', 'newApplications', e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Nhắc nhở phỏng vấn</p>
                      <p className="text-sm text-gray-500">Nhắc nhở trước 30 phút</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.pushNotifications.interviewReminders}
                      onChange={(e) => handleNotificationUpdate('pushNotifications', 'interviewReminders', e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Tin nhắn mới</p>
                      <p className="text-sm text-gray-500">Thông báo tin nhắn từ ứng viên</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.pushNotifications.messageReceived}
                      onChange={(e) => handleNotificationUpdate('pushNotifications', 'messageReceived', e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cập nhật hệ thống</p>
                      <p className="text-sm text-gray-500">Thông báo bảo trì và tính năng mới</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.pushNotifications.systemUpdates}
                      onChange={(e) => handleNotificationUpdate('pushNotifications', 'systemUpdates', e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tần suất thông báo</label>
                <select
                  value={notifications.frequency}
                  onChange={(e) => setNotifications(prev => ({...prev, frequency: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                >
                  <option value="immediately">Ngay lập tức</option>
                  <option value="daily">Hàng ngày</option>
                  <option value="weekly">Hàng tuần</option>
                </select>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Bảo mật tài khoản</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Xác thực 2 yếu tố</p>
                      <p className="text-sm text-gray-500">Tăng cường bảo mật với xác thực qua SMS hoặc ứng dụng</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={security.twoFactorAuth}
                        onChange={(e) => setSecurity(prev => ({...prev, twoFactorAuth: e.target.checked}))}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      {security.twoFactorAuth && (
                        <span className="text-sm text-green-600">Đã bật</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Thông báo đăng nhập</p>
                      <p className="text-sm text-gray-500">Nhận email khi có đăng nhập từ thiết bị mới</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={security.loginNotifications}
                      onChange={(e) => setSecurity(prev => ({...prev, loginNotifications: e.target.checked}))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Mật khẩu</h3>
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Đổi mật khẩu
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Lần thay đổi cuối: {new Date(security.passwordLastChanged).toLocaleDateString('vi-VN')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thiết bị đã đăng nhập</h3>
                <div className="space-y-3">
                  {(security.activeDevices || []).map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {device.name}
                            {device.current && <span className="ml-2 text-green-600">(Hiện tại)</span>}
                          </p>
                          <p className="text-sm text-gray-500">{device.location}</p>
                          <p className="text-xs text-gray-400">Lần cuối: {device.lastAccess}</p>
                        </div>
                      </div>
                      {!device.current && (
                        <button className="text-red-600 hover:text-red-700 text-sm">
                          Đăng xuất
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Đổi mật khẩu</h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterProfile;
