# ỨNG DỤNG QUẢN LÝ HỌC TẬP: API & OFFLINE MODE
> **BÀI THỰC HÀNH 4 – PHÁT TRIỂN ỨNG DỤNG DI ĐỘNG**

---

## 1. Giới thiệu tổng quan
Ứng dụng Quản lý học tập nâng cấp từ Thực hành 3:
- Kết nối REST API thực tế với **json-server** giả lập độ trễ mạng (800ms).
- Tách biệt hoàn toàn tầng gọi API, tầng lưu trữ cục bộ, tầng quản lý trạng thái (Context) và tầng giao diện (Presentation).
- Hỗ trợ **chế độ Offline toàn diện**: Đọc cache khi mất mạng, xếp hàng các thao tác thay đổi (Outbox), tự động đồng bộ khi có mạng và có cơ chế giải quyết xung đột dữ liệu (Conflict Resolution).

---

## 2. Công nghệ sử dụng
- **React Native (0.87.1)** / Metro Bundler
- **React Navigation v7**: Bottom Tab (5 tab) + Native Stack độc lập cho từng tab
- **@react-native-async-storage/async-storage**: Lưu trữ bộ nhớ đệm (Cache) và hàng đợi (Outbox Queue)
- **@react-native-community/netinfo**: Theo dõi thời gian thực trạng thái kết nối mạng
- **json-server@0.17.4**: Mock REST API với các quan hệ `_expand` và sắp xếp `_sort`

---

## 3. Cấu trúc thư mục chuẩn (Clean Architecture)
Dự án tuân thủ nghiêm ngặt cấu trúc thư mục và quy tắc phân tầng:
```
StudyManager/
├── App.js                        # Chỉ bọc Provider + AppNavigator
├── db.json                       # Cơ sở dữ liệu json-server (ít nhất 5 bản ghi/bảng)
├── README.md                     # Tài liệu hướng dẫn và đặc tả giải quyết xung đột
└── src/
    ├── config.js                 # BASE_URL, TIMEOUT, CACHE_TTL
    ├── api/                      # Tầng gọi mạng (Client + Services)
    │   ├── client.js             # Hàm request chung có timeout 10s và chuẩn hóa lỗi
    │   ├── studentService.js
    │   ├── courseService.js
    │   ├── sessionService.js
    │   ├── assignmentService.js
    │   └── gradeService.js
    ├── storage/                  # Tầng lưu trữ dữ liệu cục bộ
    │   ├── keys.js               # Các hằng số khóa AsyncStorage
    │   ├── cache.js              # getCache, setCache, removeCache
    │   └── outbox.js             # enqueue, getAll, remove, clear (FIFO)
    ├── context/                  # Quản lý trạng thái ứng dụng
    │   ├── AppDataContext.js     # Chia sẻ dữ liệu student, courses, assignments, grades
    │   └── SyncContext.js        # isOnline, pendingCount, syncNow, isItemPending
    ├── hooks/                    # Custom Hooks
    │   ├── useNetworkStatus.js   # Theo dõi kết nối mạng qua NetInfo
    │   ├── useCachedQuery.js     # Truy vấn theo chiến lược Cache-first, Network-later
    │   └── useOutboxSync.js      # Tự động gửi hàng đợi outbox khi có mạng trở lại
    ├── navigation/               # Điều hướng
    │   ├── routes.js             # Hằng số định danh tất cả màn hình
    │   ├── AppNavigator.js       # Bottom Tab (5 tab với icon và badge bài tập)
    │   ├── HomeStack.js          # Stack Tổng quan
    │   ├── CourseStack.js        # Stack Môn học
    │   ├── ScheduleStack.js      # Stack Thời khóa biểu
    │   ├── AssignmentStack.js    # Stack Bài tập
    │   └── ProfileStack.js       # Stack Cá nhân
    ├── screens/                  # Các màn hình giao diện
    │   ├── home/
    │   │   └── HomeScreen.js
    │   ├── courses/
    │   │   ├── CourseListScreen.js
    │   │   └── CourseDetailScreen.js
    │   ├── schedule/
    │   │   ├── ScheduleScreen.js
    │   │   └── SessionDetailScreen.js
    │   ├── assignments/
    │   │   ├── AssignmentListScreen.js
    │   │   ├── AssignmentDetailScreen.js
    │   │   └── AssignmentFormScreen.js
    │   └── profile/
    │       ├── ProfileScreen.js
    │       ├── EditProfileScreen.js
    │       ├── GradeListScreen.js
    │       └── GradeDetailScreen.js
    ├── components/               # Các component trình bày tái sử dụng
    │   ├── common/
    │   │   ├── ScreenContainer.js
    │   │   ├── OfflineBanner.js
    │   │   ├── LoadingView.js
    │   │   ├── ErrorView.js
    │   │   ├── EmptyState.js
    │   │   ├── SearchBar.js
    │   │   ├── FilterChips.js
    │   │   ├── SyncBadge.js
    │   │   ├── LastUpdatedText.js
    │   │   ├── AppButton.js
    │   │   └── FormInput.js
    │   ├── course/
    │   │   └── CourseCard.js
    │   ├── schedule/
    │   │   ├── DaySelector.js
    │   │   └── SessionCard.js
    │   ├── assignment/
    │   │   ├── AssignmentItem.js
    │   │   └── StatusToggle.js
    │   ├── grade/
    │   │   ├── GpaSummary.js
    │   │   └── GradeRow.js
    │   └── profile/
    │       └── InfoRow.js
    ├── theme/                    # Design System Tokens
    │   ├── colors.js
    │   ├── spacing.js
    │   └── typography.js
    └── utils/                    # Tiện ích
        ├── date.js               # formatDate, formatDateTime, isOverdue, daysLeft
        ├── gpa.js                # toScale4, calcGpa (trọng số tín chỉ)
        └── validators.js         # Kiểm tra tính hợp lệ của dữ liệu biểu mẫu
```

---

## 4. Hướng dẫn cài đặt và khởi chạy

### Bước 1: Cài đặt các gói phụ thuộc
```bash
npm install
```

### Bước 2: Khởi động Mock API (json-server)
Ứng dụng đã được tích hợp sẵn lệnh khởi chạy `json-server` theo đúng chuẩn yêu cầu:
```bash
npm run server
```
Server sẽ chạy tại `http://0.0.0.0:3000` với độ trễ 800ms.

### Bước 3: Cấu hình BASE_URL (nếu cần)
Mở file `src/config.js`:
- **Android Emulator**: `http://10.0.2.2:3000` (đã được cấu hình tự động khi chạy Android).
- **Thiết bị thật qua Wi-Fi**: Đổi `BASE_URL` thành địa chỉ IP LAN của máy tính, ví dụ `http://192.168.1.15:3000`.

### Bước 4: Chạy ứng dụng React Native
```bash
# Khởi động Metro Bundler
npm start

# Hoặc chạy trực tiếp trên máy ảo Android
npm run android
```

---

## 5. Chiến lược Offline và Đồng bộ dữ liệu (Offline Mode)

### 5.1. Cache trước, Mạng sau (Cache-first, Network-later)
- Mỗi khi thực hiện truy vấn `GET` thành công, dữ liệu được ghi đè vào AsyncStorage kèm mốc thời gian lưu (`savedAt`).
- Khi mở bất kỳ màn hình nào, ứng dụng lập tức đọc dữ liệu từ cache và hiển thị ngay trên màn hình (người dùng không phải chờ đợi). Song song đó, ứng dụng phát tín hiệu gọi API lên server để nhận dữ liệu mới nhất và làm mới cache.
- Khi mất mạng (offline), ứng dụng hiển thị `OfflineBanner` màu đỏ ở trên cùng và dòng thông báo thời gian cập nhật lần cuối: `"Cập nhật lần cuối: HH:mm, dd/MM/yyyy"`.

### 5.2. Cập nhật lạc quan (Optimistic Update)
- Khi bấm đổi trạng thái bài tập (`todo` ↔ `done`), giao diện thay đổi ngay lập tức để đem lại trải nghiệm mượt mà nhất.
- Nếu gửi API lên server bị lỗi (mã lỗi HTTP hoặc timeout), ứng dụng tự động hoàn tác (revert) lại trạng thái ban đầu và hiển thị thông báo lỗi.

### 5.3. Hàng đợi thao tác ngoại tuyến (Outbox Queue)
- Khi không có mạng, các thao tác:
  1. Đổi trạng thái bài tập (`PATCH /assignments/:id`)
  2. Thêm bài tập mới (`POST /assignments`)
  3. Cập nhật thông tin cá nhân (`PATCH /students/1`)
  không bị chặn.
- Các thao tác này được đóng gói thành các đối tượng có cấu trúc:
  ```json
  {
    "id": "outbox_1729900000_abcde",
    "method": "PATCH",
    "url": "/assignments/1",
    "body": { "status": "done", "updatedAt": "2026-10-26T14:00:00Z" },
    "createdAt": "2026-10-26T14:00:00Z",
    "entityId": 1,
    "entityType": "assignment"
  }
  ```
  và lưu vào hàng đợi outbox trong AsyncStorage.
- Các mục đang chờ đồng bộ sẽ hiển thị nhãn **"Chưa đồng bộ"** (`SyncBadge`).

### 5.4. Cơ chế tự động đồng bộ (Auto-sync)
- Custom hook `useOutboxSync` liên tục lắng nghe trạng thái mạng từ `@react-native-community/netinfo`.
- Ngay khi mạng chuyển từ `false` sang `true`:
  1. Duyệt tuần tự các thao tác trong hàng đợi theo thứ tự vào trước - ra trước (FIFO).
  2. Gửi request tương ứng lên server.
  3. Nếu thao tác thành công: Xóa khỏi hàng đợi (`remove(id)`).
  4. Sau khi hoàn tất hàng đợi: Hiển thị thông báo `Đã đồng bộ X thay đổi` và làm mới toàn bộ dữ liệu trên các màn hình.

### 5.5. Cơ chế giải quyết xung đột dữ liệu (Conflict Resolution - Yêu cầu B5)
Trong môi trường ngoại tuyến, có thể xảy ra trường hợp:
- Người dùng chỉnh sửa dữ liệu offline tại máy khách (Client).
- Cùng lúc đó, trên server (hoặc một thiết bị khác), dữ liệu của bản ghi đó đã được cập nhật với thời điểm mới hơn.

**Thuật toán xử lý xung đột trong `src/hooks/useOutboxSync.js`:**
1. Khi đồng bộ thao tác `PATCH`, trước khi gửi dữ liệu sửa đổi lên server, client thực hiện gọi `GET` để lấy bản ghi hiện tại trên server.
2. So sánh trường `serverRecord.updatedAt` với thời điểm tạo thao tác offline `action.createdAt` (hoặc `action.body.updatedAt`):
   - **Nếu `serverTime > clientTime`**: Dữ liệu trên server mới hơn thao tác offline của người dùng.
   - **Hành động xử lý (Server Wins)**:
     - Ứng dụng quyết định **ưu tiên dữ liệu từ máy chủ**, không thực hiện ghi đè thao tác cũ lên server nữa.
     - Xóa thao tác bị xung đột ra khỏi hàng đợi Outbox (`remove(action.id)`).
     - Hiển thị thông báo cảnh báo rõ ràng cho người dùng:
       > *"Mục [Tên mục] đã được cập nhật trên server (vào lúc HH:mm, dd/MM/yyyy). Thay đổi offline bị hủy để ưu tiên dữ liệu máy chủ."*
     - Tải lại dữ liệu mới nhất từ server về cache và cập nhật giao diện.
   - **Nếu `serverTime <= clientTime`**: Không có xung đột; ứng dụng thực hiện `PATCH` bình thường và xóa thao tác khỏi hàng đợi.

---

## 6. Hướng dẫn kiểm thử 7 kịch bản bắt buộc (Mục 6)

| # | Kịch bản kiểm thử | Thao tác thực hiện | Kết quả mong đợi |
|---|---|---|---|
| **1** | Mở ứng dụng lần đầu khi chưa bật `json-server` | Tắt task json-server, xóa cache ứng dụng hoặc mở lần đầu | Hiển thị màn hình `ErrorView` với thông báo "Không thể kết nối đến máy chủ" kèm nút **"Thử lại"**, ứng dụng không bị crash. |
| **2** | Mở app khi có mạng, sau đó bật chế độ máy bay và mở lại app | Bật server, mở app cho tải xong dữ liệu. Sau đó ngắt mạng (Airplane mode) và khởi động lại app | Dữ liệu vẫn hiển thị đầy đủ từ bộ nhớ đệm (Cache), xuất hiện banner màu đỏ **"Bạn đang offline"** và dòng chữ **"Cập nhật lần cuối: HH:mm, dd/MM/yyyy"**. |
| **3** | Thao tác khi đang Offline | Ngắt mạng: Bấm đổi trạng thái 2 bài tập sang Đã xong, vào form bấm thêm 1 bài tập mới | Trạng thái đổi ngay trên giao diện (Optimistic update); bài tập mới thêm xuất hiện ngay; các bài này hiển thị nhãn **"Chưa đồng bộ"** màu cam. |
| **4** | Tắt chế độ máy bay (Khôi phục mạng) | Bật lại mạng Wi-Fi/kết nối mạng | Banner offline biến mất; ứng dụng tự động đồng bộ hàng đợi; hiển thị thông báo **"Đã đồng bộ X thay đổi"**; các nhãn "Chưa đồng bộ" biến mất; kiểm tra file `db.json` thấy dữ liệu đã được cập nhật đúng. |
| **5** | Kiểm tra xử lý xung đột | Ngắt mạng, vào Sửa thông tin cá nhân đổi tên thành "Nguyễn Văn B". Trên máy tính, sửa trực tiếp `db.json` trường `fullName` thành "Nguyễn Văn C" và `updatedAt` lớn hơn thời điểm hiện tại. Sau đó bật lại mạng | Hệ thống phát hiện xung đột, ưu tiên dữ liệu máy chủ "Nguyễn Văn C", hiển thị thông báo xung đột và cập nhật tên trên app thành "Nguyễn Văn C". |
| **6** | Tìm kiếm môn không tồn tại hoặc lọc học kỳ không có dữ liệu | Nhập từ khóa không có thật vào ô tìm kiếm ở tab Môn học | Hiển thị `EmptyState` thân thiện ("Không tìm thấy môn học nào") kèm nút "Đặt lại bộ lọc". |
| **7** | Kéo để làm mới (Pull-to-refresh) | Vuốt kéo từ trên xuống ở danh sách Môn học, Thời khóa biểu, Bài tập, Cá nhân | Vòng xoay Refreshing hoạt động, dữ liệu được tải lại từ server và thời gian cập nhật lần cuối được cập nhật mới. |
