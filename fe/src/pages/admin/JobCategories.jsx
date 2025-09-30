import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import adminService from '@/services/adminService';

const JobCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true
  });
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchCategoryStats();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminService.getJobCategories();
      
      if (response.success) {
        setCategories(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryStats = async () => {
    try {
      const response = await adminService.getCategoryStats();
      if (response.success) {
        setStats(response.data || {});
      }
    } catch (error) {
      console.error('Error fetching category stats:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      is_active: category.is_active !== undefined ? category.is_active : true
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        setActionLoading(prev => ({ ...prev, [id]: true }));
        const response = await adminService.deleteJobCategory(id);
        
        if (response.success) {
          setCategories(categories.filter((cat) => (cat._id || cat.id) !== id));
          toast.success('Xóa danh mục thành công');
          fetchCategoryStats(); // Refresh stats
        } else {
          throw new Error(response.message || 'Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Không thể xóa danh mục');
      } finally {
        setActionLoading(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  const toggleStatus = async (id) => {
    try {
      setActionLoading(prev => ({ ...prev, [id]: true }));
      const response = await adminService.toggleJobCategoryStatus(id);
      
      if (response.success) {
        setCategories(categories.map((cat) => {
          const catId = cat._id || cat.id;
          return catId === id ? { ...cat, is_active: !cat.is_active } : cat;
        }));
        toast.success('Cập nhật trạng thái thành công');
      } else {
        throw new Error(response.message || 'Failed to toggle status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Không thể cập nhật trạng thái');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên danh mục');
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, submit: true }));
      let response;
      
      if (editingCategory) {
        response = await adminService.updateJobCategory(editingCategory._id || editingCategory.id, formData);
      } else {
        response = await adminService.createJobCategory(formData);
      }

      if (response.success) {
        toast.success(editingCategory ? 'Cập nhật danh mục thành công' : 'Thêm danh mục thành công');
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '', is_active: true });
        fetchCategories();
        fetchCategoryStats();
      } else {
        throw new Error(response.message || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Không thể lưu danh mục');
    } finally {
      setActionLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getCategoryId = (category) => {
    return category._id || category.id;
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý danh mục công việc
          </h1>
          <p className="mt-1 text-gray-600">
            Quản lý các danh mục công việc và phân loại tin tuyển dụng
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', description: '', is_active: true });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thêm danh mục
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
          <div className="text-sm text-gray-600">Tổng danh mục</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            {categories.filter(c => c.is_active).length}
          </div>
          <div className="text-sm text-gray-600">Đang hoạt động</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-red-600">
            {categories.filter(c => !c.is_active).length}
          </div>
          <div className="text-sm text-gray-600">Tạm dừng</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-purple-600">
            {stats.totalJobs || 0}
          </div>
          <div className="text-sm text-gray-600">Tổng việc làm</div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách danh mục ({categories.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số việc làm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length > 0 ? (
                categories.map((category) => {
                  const categoryId = getCategoryId(category);
                  const isActionLoading = actionLoading[categoryId];
                  
                  return (
                    <tr key={categoryId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {category.description || 'Chưa có mô tả'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {category.job_count || 0} việc làm
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            category.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {category.is_active ? "Hoạt động" : "Tạm dừng"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.created_at 
                          ? new Date(category.created_at).toLocaleDateString('vi-VN')
                          : 'N/A'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          disabled={isActionLoading}
                          className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => toggleStatus(categoryId)}
                          disabled={isActionLoading}
                          className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                        >
                          {isActionLoading ? 'Đang xử lý...' : 
                           (category.is_active ? "Tạm dừng" : "Kích hoạt")}
                        </button>
                        <button
                          onClick={() => handleDelete(categoryId)}
                          disabled={isActionLoading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                      </svg>
                      <p className="text-lg font-medium">Chưa có danh mục nào</p>
                      <p className="text-sm">Hãy thêm danh mục đầu tiên để bắt đầu</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal thêm/sửa danh mục */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên danh mục *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên danh mục"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mô tả danh mục (không bắt buộc)"
                  />
                </div>

                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Kích hoạt ngay</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingCategory(null);
                      setFormData({ name: '', description: '', is_active: true });
                    }}
                    disabled={actionLoading.submit}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading.submit}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {actionLoading.submit 
                      ? 'Đang xử lý...' 
                      : (editingCategory ? "Cập nhật" : "Thêm")
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCategories;
