import { Link } from 'react-router';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tìm kiếm việc làm IT
              <br />
              <span className="text-primary-200">hoàn hảo cho bạn</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Kết nối với hàng nghìn cơ hội việc làm IT từ các công ty hàng đầu
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/jobs"
                className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Tìm việc ngay
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-6 -mt-16 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Tìm kiếm công việc..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>Tất cả danh mục</option>
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
                <option>Fullstack Developer</option>
                <option>Mobile Developer</option>
                <option>DevOps Engineer</option>
              </select>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>Tất cả địa điểm</option>
                <option>Hà Nội</option>
                <option>Hồ Chí Minh</option>
                <option>Đà Nẵng</option>
                <option>Remote</option>
              </select>
              <button className="bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-semibold">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">10,000+</div>
              <div className="text-gray-600">Việc làm IT</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">5,000+</div>
              <div className="text-gray-600">Công ty</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">50,000+</div>
              <div className="text-gray-600">Ứng viên</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-gray-600">Tỷ lệ thành công</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Việc làm nổi bật
            </h2>
            <p className="text-xl text-gray-600">
              Những cơ hội việc làm IT tốt nhất đang chờ bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((job) => (
              <div key={job} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-primary-600 font-bold">C</span>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Mới
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Senior Frontend Developer
                </h3>
                <p className="text-gray-600 mb-2">FPT Software</p>
                <p className="text-gray-600 mb-4">Hà Nội • Full-time</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary-600 font-semibold">
                    $1,500 - $2,500
                  </span>
                  <Link
                    to={`/jobs/${job}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Xem chi tiết →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/jobs"
              className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
            >
              Xem tất cả việc làm
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cách thức hoạt động
            </h2>
            <p className="text-xl text-gray-600">
              Chỉ với 3 bước đơn giản để tìm được việc làm mơ ước
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tạo hồ sơ
              </h3>
              <p className="text-gray-600">
                Tạo hồ sơ chuyên nghiệp với thông tin cá nhân và kỹ năng của bạn
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tìm kiếm việc làm
              </h3>
              <p className="text-gray-600">
                Sử dụng công cụ tìm kiếm thông minh để tìm công việc phù hợp
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ứng tuyển
              </h3>
              <p className="text-gray-600">
                Gửi hồ sơ ứng tuyển và chờ phản hồi từ nhà tuyển dụng
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
