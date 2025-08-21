const CandidateProfile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hồ sơ ứng viên</h1>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="Nguyễn Văn A" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="nguyen.vana@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="0123456789" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="Hà Nội, Việt Nam" />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Kỹ năng</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">JavaScript</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">React</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Node.js</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">TypeScript</span>
            </div>
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              + Thêm kỹ năng
            </button>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Kinh nghiệm làm việc</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary-500 pl-4">
                <h3 className="font-medium text-gray-900">Frontend Developer</h3>
                <p className="text-gray-600">ABC Company</p>
                <p className="text-gray-500 text-sm">01/2022 - Hiện tại</p>
                <p className="text-gray-700 mt-2">Phát triển ứng dụng web sử dụng React và TypeScript...</p>
              </div>
            </div>
            <button className="mt-4 text-primary-600 hover:text-primary-700 font-medium">
              + Thêm kinh nghiệm
            </button>
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Học vấn</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-medium text-gray-900">Cử nhân Công nghệ Thông tin</h3>
                <p className="text-gray-600">Đại học Bách Khoa Hà Nội</p>
                <p className="text-gray-500 text-sm">2018 - 2022</p>
              </div>
            </div>
            <button className="mt-4 text-primary-600 hover:text-primary-700 font-medium">
              + Thêm học vấn
            </button>
          </div>

          <div className="flex justify-end">
            <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
