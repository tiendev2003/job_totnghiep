import React, { useState } from 'react';
import { formatLocation } from '@/utils/formatters';

const CandidateJobs = () => {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechCorp Vietnam',
      logo: null,
      location: 'Hà Nội',
      type: 'full-time',
      salary: '15-25 triệu VNĐ',
      experience: '2-3 năm',
      deadline: '2024-02-15',
      postedDate: '2024-01-10',
      isBookmarked: true,
      skills: ['React', 'JavaScript', 'TypeScript', 'CSS'],
      description: 'Tìm kiếm Frontend Developer có kinh nghiệm với React để tham gia team phát triển sản phẩm.',
      isApplied: false,
      matchScore: 92
    },
    {
      id: 2,
      title: 'React Developer',
      company: 'Digital Solutions',
      logo: null,
      location: 'TP. Hồ Chí Minh',
      type: 'full-time',
      salary: '18-30 triệu VNĐ',
      experience: '3-5 năm',
      deadline: '2024-02-20',
      postedDate: '2024-01-08',
      isBookmarked: false,
      skills: ['React', 'Node.js', 'Redux', 'TypeScript'],
      description: 'Vị trí React Developer cho dự án fintech, yêu cầu kinh nghiệm solid về React ecosystem.',
      isApplied: true,
      matchScore: 88
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      logo: null,
      location: 'Đà Nẵng',
      type: 'full-time',
      salary: '20-35 triệu VNĐ',
      experience: '3+ năm',
      deadline: '2024-02-10',
      postedDate: '2024-01-05',
      isBookmarked: true,
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
      description: 'Cơ hội tham gia startup với vai trò Full Stack Developer, phát triển platform e-commerce.',
      isApplied: false,
      matchScore: 85
    },
    {
      id: 4,
      title: 'Vue.js Developer',
      company: 'Innovation Hub',
      logo: null,
      location: 'Hà Nội',
      type: 'part-time',
      salary: '12-20 triệu VNĐ',
      experience: '1-2 năm',
      deadline: '2024-02-25',
      postedDate: '2024-01-12',
      isBookmarked: false,
      skills: ['Vue.js', 'JavaScript', 'Vuex', 'CSS'],
      description: 'Part-time Vue.js Developer cho dự án web application trong lĩnh vực giáo dục.',
      isApplied: false,
      matchScore: 78
    },
    {
      id: 5,
      title: 'Junior Frontend Developer',
      company: 'WebTech Co.',
      logo: null,
      location: 'Remote',
      type: 'remote',
      salary: '10-15 triệu VNĐ',
      experience: '0-1 năm',
      deadline: '2024-03-01',
      postedDate: '2024-01-15',
      isBookmarked: false,
      skills: ['HTML', 'CSS', 'JavaScript', 'React'],
      description: 'Vị trí Junior Frontend Developer làm việc remote, phù hợp cho fresh graduate.',
      isApplied: true,
      matchScore: 75
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    experience: '',
    salary: '',
    showBookmarked: false,
    showApplied: false
  });

  const [sortBy, setSortBy] = useState('relevance'); // relevance, newest, salary, deadline

  const toggleBookmark = (jobId) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
    ));
  };

  const applyToJob = (jobId) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, isApplied: true } : job
    ));
  };

  const getJobTypeBadge = (type) => {
    const badges = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-yellow-100 text-yellow-800',
      'remote': 'bg-blue-100 text-blue-800',
      'freelance': 'bg-purple-100 text-purple-800'
    };

    const labels = {
      'full-time': 'Toàn thời gian',
      'part-time': 'Bán thời gian',
      'remote': 'Làm từ xa',
      'freelance': 'Freelance'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badges[type]}`}>
        {labels[type]}
      </span>
    );
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getDaysRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Đã hết hạn';
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Còn 1 ngày';
    return `Còn ${diffDays} ngày`;
  };

  const filteredJobs = jobs.filter(job => {
    if (filters.search && !job.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !job.company.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.location && job.location !== filters.location) return false;
    if (filters.type && job.type !== filters.type) return false;
    if (filters.showBookmarked && !job.isBookmarked) return false;
    if (filters.showApplied && !job.isApplied) return false;
    return true;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.postedDate) - new Date(a.postedDate);
      case 'deadline':
        return new Date(a.deadline) - new Date(b.deadline);
      case 'salary':
        return parseInt(b.salary.split('-')[1]) - parseInt(a.salary.split('-')[1]);
      case 'relevance':
      default:
        return b.matchScore - a.matchScore;
    }
  });

  const jobStats = {
    total: jobs.length,
    applied: jobs.filter(job => job.isApplied).length,
    bookmarked: jobs.filter(job => job.isBookmarked).length,
    matching: jobs.filter(job => job.matchScore >= 80).length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Việc làm phù hợp</h1>
        <div className="text-sm text-gray-500">
          {filteredJobs.length} / {jobs.length} việc làm
        </div>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Tổng việc làm</p>
          <p className="text-2xl font-semibold text-gray-900">{jobStats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Đã ứng tuyển</p>
          <p className="text-2xl font-semibold text-blue-600">{jobStats.applied}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Đã lưu</p>
          <p className="text-2xl font-semibold text-yellow-600">{jobStats.bookmarked}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Độ phù hợp cao</p>
          <p className="text-2xl font-semibold text-green-600">{jobStats.matching}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Tìm theo tên công việc, công ty..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <select
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả địa điểm</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <select
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Loại hình</option>
              <option value="full-time">Toàn thời gian</option>
              <option value="part-time">Bán thời gian</option>
              <option value="remote">Làm từ xa</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="relevance">Độ phù hợp</option>
              <option value="newest">Mới nhất</option>
              <option value="deadline">Hạn nộp</option>
              <option value="salary">Mức lương</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setFilters({...filters, showBookmarked: !filters.showBookmarked})}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                filters.showBookmarked
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Đã lưu
            </button>
            <button
              onClick={() => setFilters({...filters, showApplied: !filters.showApplied})}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                filters.showApplied
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Đã ứng tuyển
            </button>
          </div>
        </div>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {sortedJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      {job.logo ? (
                        <img src={job.logo} alt={job.company} className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <span className="text-xl text-gray-400">🏢</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{job.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${getMatchScoreColor(job.matchScore)}`}>
                            {job.matchScore}% phù hợp
                          </span>
                          <button
                            onClick={() => toggleBookmark(job.id)}
                            className={`p-1 rounded ${
                              job.isBookmarked
                                ? 'text-yellow-500 hover:text-yellow-600'
                                : 'text-gray-400 hover:text-gray-500'
                            }`}
                          >
                            <svg className="w-5 h-5" fill={job.isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <p className="text-blue-600 font-medium mb-2">{job.company}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {formatLocation(job.location)}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          {job.salary}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M8 6a2 2 0 00-2 2v6.002" />
                          </svg>
                          {job.experience}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {getDaysRemaining(job.deadline)}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {getJobTypeBadge(job.type)}
                          {job.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{job.skills.length - 3} khác
                            </span>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                            Xem chi tiết
                          </button>
                          {job.isApplied ? (
                            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                              Đã ứng tuyển
                            </span>
                          ) : (
                            <button
                              onClick={() => applyToJob(job.id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                            >
                              Ứng tuyển
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {sortedJobs.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy việc làm phù hợp</h3>
            <p className="text-gray-500 mb-4">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.</p>
            <button
              onClick={() => setFilters({
                search: '',
                location: '',
                type: '',
                experience: '',
                salary: '',
                showBookmarked: false,
                showApplied: false
              })}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Load more */}
      {sortedJobs.length > 0 && (
        <div className="text-center">
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Tải thêm việc làm
          </button>
        </div>
      )}
    </div>
  );
};

export default CandidateJobs;
