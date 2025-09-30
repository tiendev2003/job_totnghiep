import React, { useState } from 'react';

const RecruiterCandidates = () => {
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn An',
      email: 'nguyenvanan@example.com',
      phone: '0987654321',
      position: 'Frontend Developer',
      experience: '3 năm',
      location: 'Hà Nội',
      salary: '20 triệu',
      skills: ['React', 'JavaScript', 'TypeScript', 'CSS'],
      education: 'Đại học Bách Khoa Hà Nội',
      appliedJobs: ['Frontend Developer', 'React Developer'],
      status: 'available',
      profileViews: 45,
      lastActive: '2024-01-15',
      matchScore: 92,
      avatar: null
    },
    {
      id: 2,
      name: 'Trần Thị Lan',
      email: 'tranthilan@example.com',
      phone: '0976543210',
      position: 'Backend Developer',
      experience: '2 năm',
      location: 'TP. Hồ Chí Minh',
      salary: '18 triệu',
      skills: ['Node.js', 'Python', 'MongoDB', 'PostgreSQL'],
      education: 'Đại học Khoa học Tự nhiên',
      appliedJobs: ['Backend Developer'],
      status: 'interviewing',
      profileViews: 32,
      lastActive: '2024-01-14',
      matchScore: 88,
      avatar: null
    },
    {
      id: 3,
      name: 'Lê Văn Minh',
      email: 'levanminh@example.com',
      phone: '0965432109',
      position: 'Full Stack Developer',
      experience: '5 năm',
      location: 'Đà Nẵng',
      salary: '30 triệu',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
      education: 'Đại học Duy Tân',
      appliedJobs: ['Full Stack Developer', 'Senior Developer'],
      status: 'hired',
      profileViews: 78,
      lastActive: '2024-01-13',
      matchScore: 95,
      avatar: null
    },
    {
      id: 4,
      name: 'Phạm Thị Hương',
      email: 'phamthihuong@example.com',
      phone: '0954321098',
      position: 'UI/UX Designer',
      experience: '1 năm',
      location: 'Hà Nội',
      salary: '12 triệu',
      skills: ['Figma', 'Adobe XD', 'Photoshop', 'HTML/CSS'],
      education: 'Đại học Kiến trúc Hà Nội',
      appliedJobs: ['UI/UX Designer'],
      status: 'available',
      profileViews: 23,
      lastActive: '2024-01-16',
      matchScore: 75,
      avatar: null
    },
    {
      id: 5,
      name: 'Hoàng Văn Đức',
      email: 'hoangvanduc@example.com',
      phone: '0943210987',
      position: 'DevOps Engineer',
      experience: '4 năm',
      location: 'TP. Hồ Chí Minh',
      salary: '35 triệu',
      skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Linux'],
      education: 'Đại học Bách Khoa TP.HCM',
      appliedJobs: ['DevOps Engineer', 'System Administrator'],
      status: 'not_available',
      profileViews: 56,
      lastActive: '2024-01-10',
      matchScore: 90,
      avatar: null
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    position: '',
    location: '',
    experience: '',
    status: '',
    skills: ''
  });

  const [sortBy, setSortBy] = useState('relevance'); // relevance, newest, experience, salary
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const getStatusBadge = (status) => {
    const badges = {
      available: 'bg-green-100 text-green-800',
      interviewing: 'bg-blue-100 text-blue-800',
      hired: 'bg-purple-100 text-purple-800',
      not_available: 'bg-red-100 text-red-800',
      contacted: 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      available: 'Sẵn sàng',
      interviewing: 'Đang phỏng vấn',
      hired: 'Đã tuyển',
      not_available: 'Không sẵn sàng',
      contacted: 'Đã liên hệ'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const filteredCandidates = candidates.filter(candidate => {
    if (filters.search && !candidate.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !candidate.email.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.position && candidate.position !== filters.position) return false;
    if (filters.location && candidate.location !== filters.location) return false;
    if (filters.status && candidate.status !== filters.status) return false;
    if (filters.skills && !candidate.skills.some(skill => 
        skill.toLowerCase().includes(filters.skills.toLowerCase()))) return false;
    return true;
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.lastActive) - new Date(a.lastActive);
      case 'experience':
        return parseInt(b.experience) - parseInt(a.experience);
      case 'salary':
        return parseInt(b.salary) - parseInt(a.salary);
      case 'relevance':
      default:
        return b.matchScore - a.matchScore;
    }
  });

  const candidateStats = {
    total: candidates.length,
    available: candidates.filter(c => c.status === 'available').length,
    interviewing: candidates.filter(c => c.status === 'interviewing').length,
    hired: candidates.filter(c => c.status === 'hired').length,
    highMatch: candidates.filter(c => c.matchScore >= 90).length
  };

  const toggleCandidateSelection = (candidateId) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const selectAllCandidates = () => {
    if (selectedCandidates.length === sortedCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(sortedCandidates.map(c => c.id));
    }
  };

  const contactCandidate = (candidateId) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, status: 'contacted' }
        : candidate
    ));
  };

  const bulkContact = () => {
    setCandidates(candidates.map(candidate => 
      selectedCandidates.includes(candidate.id)
        ? { ...candidate, status: 'contacted' }
        : candidate
    ));
    setSelectedCandidates([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tìm kiếm ứng viên</h1>
        <div className="flex space-x-3">
          {selectedCandidates.length > 0 && (
            <button 
              onClick={bulkContact}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Liên hệ ({selectedCandidates.length})
            </button>
          )}
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Lưu bộ lọc
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Tổng ứng viên</p>
          <p className="text-2xl font-semibold text-gray-900">{candidateStats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Sẵn sàng</p>
          <p className="text-2xl font-semibold text-green-600">{candidateStats.available}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Đang phỏng vấn</p>
          <p className="text-2xl font-semibold text-blue-600">{candidateStats.interviewing}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Đã tuyển</p>
          <p className="text-2xl font-semibold text-purple-600">{candidateStats.hired}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Độ phù hợp cao</p>
          <p className="text-2xl font-semibold text-yellow-600">{candidateStats.highMatch}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Tìm theo tên, email..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <select
              value={filters.position}
              onChange={(e) => setFilters({...filters, position: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả vị trí</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
            </select>
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
            </select>
          </div>

          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="available">Sẵn sàng</option>
              <option value="interviewing">Đang phỏng vấn</option>
              <option value="hired">Đã tuyển</option>
              <option value="not_available">Không sẵn sàng</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="relevance">Độ phù hợp</option>
              <option value="newest">Hoạt động gần nhất</option>
              <option value="experience">Kinh nghiệm</option>
              <option value="salary">Mức lương</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Tìm theo kỹ năng (React, Node.js, Python...)"
            value={filters.skills}
            onChange={(e) => setFilters({...filters, skills: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white shadow rounded-lg">
        {sortedCandidates.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCandidates.length === sortedCandidates.length}
                onChange={selectAllCandidates}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Chọn tất cả ({sortedCandidates.length} ứng viên)
              </label>
            </div>
          </div>
        )}

        <div className="divide-y divide-gray-200">
          {sortedCandidates.map((candidate) => (
            <div key={candidate.id} className="p-6">
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={selectedCandidates.includes(candidate.id)}
                  onChange={() => toggleCandidateSelection(candidate.id)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />

                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  {candidate.avatar ? (
                    <img src={candidate.avatar} alt={candidate.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-xl text-gray-400">👤</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{candidate.name}</h3>
                      <p className="text-blue-600 font-medium">{candidate.position}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-sm font-medium ${getMatchScoreColor(candidate.matchScore)}`}>
                        {candidate.matchScore}% phù hợp
                      </span>
                      {getStatusBadge(candidate.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {candidate.location}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M8 6a2 2 0 00-2 2v6.002" />
                      </svg>
                      {candidate.experience}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      {candidate.salary} triệu/tháng
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {candidate.profileViews} lượt xem
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Email:</strong> {candidate.email}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Học vấn:</strong> {candidate.education}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Hoạt động gần nhất:</strong> {new Date(candidate.lastActive).toLocaleDateString('vi-VN')}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {candidate.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {candidate.appliedJobs.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Đã ứng tuyển:</strong>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {candidate.appliedJobs.map((job, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {job}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Xem hồ sơ chi tiết
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Tải CV
                      </button>
                    </div>

                    <div className="flex space-x-2">
                      {candidate.status === 'available' && (
                        <>
                          <button 
                            onClick={() => contactCandidate(candidate.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Liên hệ
                          </button>
                          <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                            Mời phỏng vấn
                          </button>
                        </>
                      )}
                      
                      {candidate.status === 'interviewing' && (
                        <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                          Xem lịch phỏng vấn
                        </button>
                      )}

                      <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                        Lưu ứng viên
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedCandidates.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy ứng viên phù hợp</h3>
            <p className="text-gray-500 mb-4">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.</p>
            <button
              onClick={() => setFilters({
                search: '',
                position: '',
                location: '',
                experience: '',
                status: '',
                skills: ''
              })}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Load more */}
      {sortedCandidates.length > 0 && (
        <div className="text-center">
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Tải thêm ứng viên
          </button>
        </div>
      )}
    </div>
  );
};

export default RecruiterCandidates;
