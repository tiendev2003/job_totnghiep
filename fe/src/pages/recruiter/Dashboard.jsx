const RecruiterDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard - Nhà tuyển dụng</h1>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            Đăng tin tuyển dụng
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-primary-600">8</div>
            <div className="text-gray-600">Tin đã đăng</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">45</div>
            <div className="text-gray-600">Đơn ứng tuyển</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-gray-600">Đang phỏng vấn</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">156</div>
            <div className="text-gray-600">Lượt xem tin</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Tin tuyển dụng của bạn</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((job) => (
                  <div key={job} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Senior Frontend Developer</h3>
                      <p className="text-gray-600 text-sm">Đăng 3 ngày trước</p>
                      <p className="text-gray-500 text-xs">15 ứng viên</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Đang tuyển
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Đơn ứng tuyển mới</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((app) => (
                  <div key={app} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Nguyễn Văn A</h3>
                        <p className="text-gray-600 text-sm">Frontend Developer</p>
                        <p className="text-gray-500 text-xs">Ứng tuyển 1 giờ trước</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          Xem hồ sơ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
