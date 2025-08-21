const JobDetail = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-primary-600 font-bold text-xl">F</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Senior Frontend Developer</h1>
                    <p className="text-gray-600">FPT Software</p>
                    <p className="text-gray-600">Hà Nội • Full-time</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  Đang tuyển
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Mô tả công việc</h2>
                  <div className="text-gray-700 space-y-2">
                    <p>Chúng tôi đang tìm kiếm một Senior Frontend Developer giàu kinh nghiệm để tham gia vào đội ngũ phát triển sản phẩm.</p>
                    <p>Bạn sẽ làm việc với các công nghệ hiện đại như React, TypeScript, và nhiều công cụ khác.</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Yêu cầu</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>3+ năm kinh nghiệm với React và TypeScript</li>
                    <li>Hiểu biết sâu về HTML, CSS, JavaScript</li>
                    <li>Kinh nghiệm với các công cụ build như Webpack, Vite</li>
                    <li>Kỹ năng giao tiếp tốt</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Quyền lợi</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Lương cạnh tranh: $1,500 - $2,500</li>
                    <li>13th tháng lương + bonus</li>
                    <li>Bảo hiểm sức khỏe</li>
                    <li>Môi trường làm việc hiện đại</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Kỹ năng yêu cầu</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">React</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">TypeScript</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">JavaScript</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">HTML/CSS</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Webpack</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <div className="space-y-4">
                <button className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold">
                  Ứng tuyển ngay
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Lưu việc làm
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Thông tin công ty</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Quy mô</p>
                    <p className="font-medium">1000+ nhân viên</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lĩnh vực</p>
                    <p className="font-medium">Công nghệ thông tin</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Địa chỉ</p>
                    <p className="font-medium">Hà Nội, Việt Nam</p>
                  </div>
                </div>
                
                <button className="w-full mt-4 border border-primary-600 text-primary-600 py-2 px-4 rounded-lg hover:bg-primary-50 transition-colors">
                  Xem trang công ty
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Việc làm tương tự</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((job) => (
                    <div key={job} className="border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900 text-sm">Frontend Developer</h4>
                      <p className="text-gray-600 text-xs">Tech Company</p>
                      <p className="text-primary-600 text-xs font-medium">$1,200 - $2,000</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
