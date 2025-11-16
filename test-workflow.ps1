$API_BASE = "https://delivery-management-system-backend-2385.onrender.com/api"

Write-Host "ORDER-DELIVERY WORKFLOW TEST" -ForegroundColor Cyan

# Step 1: Login
Write-Host "Step 1: Authenticating..." -ForegroundColor Yellow
try {
  $loginResp = Invoke-RestMethod -Uri "$API_BASE/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"email":"admin@example.com","password":"AdminPass123"}' `
    -ErrorAction Stop
  
  $token = $loginResp.token
  $headers = @{ "Authorization" = "Bearer $token" }
  Write-Host "OK: Authentication successful" -ForegroundColor Green
} catch {
  Write-Host "FAILED: $_" -ForegroundColor Red
  exit 1
}


# Step 2: Create Order
Write-Host "Step 2: Creating Order (should be Pending)..." -ForegroundColor Yellow
try {
  $orderResp = Invoke-RestMethod -Uri "$API_BASE/orders" `
    -Method POST `
    -ContentType "application/json" `
    -Headers $headers `
    -Body '{
      "customer_id": 1,
      "order_item": "Test Workflow Item",
      "quantity": 5,
      "price": 100,
      "pickup_address": "123 Test St",
      "total": 500,
      "weight": 25,
      "status": "Pending"
    }' -ErrorAction Stop
  
  $orderId = $orderResp.order_id
  $orderStatus = $orderResp.status
  Write-Host "OK: Order created ID=$orderId Status=$orderStatus" -ForegroundColor Green
} catch {
  Write-Host "FAILED: $_" -ForegroundColor Red
  exit 1
}


# Step 3: Get drivers and vehicles
Write-Host "Step 3: Fetching drivers and vehicles..." -ForegroundColor Yellow
try {
  $driversResp = Invoke-RestMethod -Uri "$API_BASE/drivers" -Headers $headers -ErrorAction Stop
  $vehiclesResp = Invoke-RestMethod -Uri "$API_BASE/vehicles" -Headers $headers -ErrorAction Stop
  
  $driverId = $driversResp[0].driver_id
  $vehicleId = $vehiclesResp[0].vehicle_id
  Write-Host "OK: Driver=$driverId Vehicle=$vehicleId" -ForegroundColor Green
} catch {
  Write-Host "FAILED: $_" -ForegroundColor Red
  exit 1
}


# Step 4: Create Delivery
Write-Host "Step 4: Creating Delivery (order should transition to Scheduled)..." -ForegroundColor Yellow
try {
  $body = @{
    order_id = $orderId
    driver_id = $driverId
    vehicle_id = $vehicleId
    pickup_address = "123 Test St"
    dropoff_address = "456 Test Ave"
    delivery_date = "2025-11-16"
    expected_delivery_time = "14:00"
    delivery_fee = 50
    total = 550
    priority = "High"
    status = "Scheduled"
    recipient_name = "John Doe"
    recipient_contact = "555-1234"
  } | ConvertTo-Json
  
  $deliveryResp = Invoke-RestMethod -Uri "$API_BASE/delivery" `
    -Method POST `
    -ContentType "application/json" `
    -Headers $headers `
    -Body $body `
    -ErrorAction Stop
  
  $deliveryId = $deliveryResp.delivery.delivery_id
  Write-Host "OK: Delivery created ID=$deliveryId" -ForegroundColor Green
} catch {
  Write-Host "FAILED: $_" -ForegroundColor Red
  exit 1
}


# Step 5: Check Order Status
Write-Host "Step 5: Checking Order status after delivery..." -ForegroundColor Yellow
try {
  $orderCheckResp = Invoke-RestMethod -Uri "$API_BASE/orders/$orderId" -Headers $headers -ErrorAction Stop
  $newOrderStatus = $orderCheckResp.status
  Write-Host "Order Status: $newOrderStatus (expected: Scheduled)" -ForegroundColor Cyan
  
  if ($newOrderStatus -eq "Scheduled") {
    Write-Host "PASS: Order transitioned to Scheduled" -ForegroundColor Green
  } else {
    Write-Host "FAIL: Expected Scheduled, got $newOrderStatus" -ForegroundColor Red
  }
} catch {
  Write-Host "FAILED: $_" -ForegroundColor Red
  exit 1
}


# Step 6: Mark Delivery Completed
Write-Host "Step 6: Marking Delivery Completed..." -ForegroundColor Yellow
try {
  $updateResp = Invoke-RestMethod -Uri "$API_BASE/delivery/$deliveryId" `
    -Method PUT `
    -ContentType "application/json" `
    -Headers $headers `
    -Body '{"status":"Completed"}' `
    -ErrorAction Stop
  
  Write-Host "OK: Delivery updated" -ForegroundColor Green
} catch {
  Write-Host "FAILED: $_" -ForegroundColor Red
  exit 1
}

# Step 7: Check Final Order Status
Write-Host "Step 7: Checking final Order status..." -ForegroundColor Yellow
try {
  $orderFinalResp = Invoke-RestMethod -Uri "$API_BASE/orders/$orderId" -Headers $headers -ErrorAction Stop
  $finalOrderStatus = $orderFinalResp.status
  Write-Host "Final Order Status: $finalOrderStatus (expected: Completed)" -ForegroundColor Cyan
  
  if ($finalOrderStatus -eq "Completed") {
    Write-Host "PASS: Order transitioned to Completed" -ForegroundColor Green
  } else {
    Write-Host "FAIL: Expected Completed, got $finalOrderStatus" -ForegroundColor Red
  }
} catch {
  Write-Host "FAILED: $_" -ForegroundColor Red
  exit 1
}

Write-Host "WORKFLOW TEST COMPLETE" -ForegroundColor Green
