const RecruiterProfile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hồ sơ nhà tuyển dụng</h1>
        
        <div className="space-y-6">
          {/* Company Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin công ty</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên công ty</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="FPT Software" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input type="url" className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="https://www.fpt-software.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quy mô</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>1-10 nhân viên</option>
                  <option>11-50 nhân viên</option>
                  <option>51-200 nhân viên</option>
                  <option>201-500 nhân viên</option>
                  <option>500+ nhân viên</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lĩnh vực</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="Công nghệ thông tin" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="Hà Nội, Việt Nam" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả công ty</label>
                <textarea 
                  rows={4} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  defaultValue="FPT Software là công ty phần mềm hàng đầu Việt Nam..."
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="Nguyễn Văn B" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="recruiter@fpt.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="0987654321" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="HR Manager" />
              </div>
            </div>
          </div>

          {/* Company Benefits */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Phúc lợi công ty</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>Bảo hiểm sức khỏe</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>13th tháng lương</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Du lịch công ty</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>Đào tạo và phát triển</span>
              </div>
            </div>
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

export default RecruiterProfile;
