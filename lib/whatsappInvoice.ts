
export const AuraveinWhatsAppOrder = (order) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    };
    // @ts-ignore
    return new Intl.DateTimeFormat('en-IN', options).format(date);
  };

  const INR = (amount) => {
    if (typeof amount !== 'number') return amount;
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  const message = [
    '*Auravein Order Confirmation*',
    '',
    `*Order*: ${order.id} | ${formatDate(order.createdAt)} | ${order.paymentMethod.toUpperCase()}`,
    `*Coupon*: ${order.couponCode || 'N/A'} (${INR(order.discount || 0)})`,
    '',
    '*Customer*:',
    `${order.deliveryAddress.name} | ${order.deliveryAddress.phone} | ${order.deliveryAddress.email}`,
    '',
    '*Delivery Address*:',
    `${order.deliveryAddress.addressType.toUpperCase()}: ${order.deliveryAddress.addressLine1}${order.deliveryAddress.floor ? ', Floor: ' + order.deliveryAddress.floor : ''}`,
    `${order.deliveryAddress.addressLine2}${order.deliveryAddress.landmark ? ', ' + order.deliveryAddress.landmark : ''}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state || ''} - ${order.deliveryAddress.pincode}`,
    '',
    '*Items*:',
    ...order.items.map((item, index) => `${index + 1}) ${item.name} | ${item.color || ''}/${item.size || ''} | ${item.sku || item.id} | ${item.quantity} × ${INR(item.price)} = ${INR(item.price * item.quantity)}`),
    '',
    '*Totals*:',
    `Subtotal: ${INR(order.subtotal)}`,
    `Discount: ${INR(order.discount)}`,
    `Shipping: ${INR(order.deliveryFee)}`,
    `COD Fee: ${INR(order.codFee || 0)}`,
    `Tax: ${INR(order.tax || 0)}`,
    `*Grand Total: ${INR(order.total)}*`,
    '',
    `*Delivery*: ${order.deliveryMethod || 'Standard'} | ETA: ${order.estimatedDelivery ? formatDate(order.estimatedDelivery) : '3-5 days'}`,
    order.giftMessage ? `\n*Gift Message*: ${order.giftMessage}` : '',
  ];

  return message.join('\n');
};


import type { Order } from "./localStorage"

export const generateWhatsAppInvoice = (order: Order): string => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`
  }

  let invoice = `🛍️ *DOPE FASHION - NEW ORDER*\n`
  invoice += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`

  // Order Details
  invoice += `📋 *ORDER DETAILS*\n`
  invoice += `Order ID: #${order.id}\n`
  invoice += `Date: ${formatDate(order.createdAt)}\n`
  invoice += `Status: ${order.status.toUpperCase()}\n`
  invoice += `Payment: ${order.paymentMethod.toUpperCase()}\n\n`

  // Customer Details
  invoice += `👤 *CUSTOMER DETAILS*\n`
  invoice += `Name: ${order.deliveryAddress.name}\n`
  invoice += `Phone: ${order.deliveryAddress.phone}\n`
  invoice += `Email: ${order.deliveryAddress.email}\n\n`

  // Delivery Address
  invoice += `📍 *DELIVERY ADDRESS*\n`
  invoice += `${order.deliveryAddress.name}\n`
  invoice += `${order.deliveryAddress.addressLine1}\n`
  if (order.deliveryAddress.addressLine2) {
    invoice += `${order.deliveryAddress.addressLine2}\n`
  }
  if (order.deliveryAddress.landmark) {
    invoice += `Near: ${order.deliveryAddress.landmark}\n`
  }
  invoice += `${order.deliveryAddress.city}, ${order.deliveryAddress.state}\n`
  invoice += `PIN: ${order.deliveryAddress.pincode}\n`
  invoice += `Type: ${order.deliveryAddress.addressType.toUpperCase()}\n\n`

  // Order Items
  invoice += `🛒 *ORDER ITEMS*\n`
  invoice += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`

  order.items.forEach((item, index) => {
    invoice += `${index + 1}. *${item.name}*\n`
    invoice += `   Size: ${item.size}`
    if (item.color) {
      invoice += ` | Color: ${item.color}`
    }
    invoice += `\n`
    invoice += `   Qty: ${item.quantity} × ${formatCurrency(item.price)} = ${formatCurrency(item.quantity * item.price)}\n\n`
  })

  // Price Breakdown
  invoice += `💰 *PRICE BREAKDOWN*\n`
  invoice += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
  invoice += `Subtotal: ${formatCurrency(order.subtotal)}\n`

  if (order.discount > 0) {
    invoice += `Discount: -${formatCurrency(order.discount)}`
    if (order.couponCode) {
      invoice += ` (${order.couponCode})`
    }
    invoice += `\n`
  }

  if (order.deliveryFee > 0) {
    invoice += `Delivery Fee: ${formatCurrency(order.deliveryFee)}\n`
  } else {
    invoice += `Delivery Fee: FREE\n`
  }

  invoice += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
  invoice += `*TOTAL: ${formatCurrency(order.total)}*\n\n`

  // Payment Status
  invoice += `💳 *PAYMENT STATUS*\n`
  invoice += `Method: ${order.paymentMethod.toUpperCase()}\n`
  invoice += `Status: ${order.paymentStatus.toUpperCase()}\n`
  if (order.transactionId) {
    invoice += `Transaction ID: ${order.transactionId}\n`
  }
  invoice += `\n`

  // Estimated Delivery
  if (order.estimatedDelivery) {
    invoice += `🚚 *ESTIMATED DELIVERY*\n`
    invoice += `${formatDate(order.estimatedDelivery)}\n\n`
  }

  // Footer
  invoice += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
  invoice += `Thank you for shopping with DOPE! 🙏\n`
  invoice += `For support: Contact us anytime\n`
  invoice += `Website: https://dope-fashion.com\n`
  invoice += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

  return invoice
}

export const sendWhatsAppInvoice = (order: Order, adminPhone = "919876543210") => {
  const invoice = generateWhatsAppInvoice(order)
  const encodedMessage = encodeURIComponent(invoice)
  const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`

  // Open WhatsApp in a new tab
  window.open(whatsappUrl, "_blank")

  return whatsappUrl
}

/**
 * Formats order details into a WhatsApp message string (multi-line, as per requirements).
 * @param {Object} params - All order details needed for the WhatsApp message.
 * @returns {string} - The formatted WhatsApp message.
 */
export function buildWhatsAppOrderText(params) {
  const {
    orderId,
    timestamp,
    paymentMethod,
    couponCode,
    discountTotal,
    customerName,
    customerPhone,
    customerEmail,
    address,
    items,
    subtotal,
    shipping,
    codFee,
    taxTotal,
    grandTotal,
    deliveryMethod,
    eta,
    giftMessage,
  } = params;

  const lines = [];
  lines.push(`Order ID: ${orderId}`);
  lines.push(`Placed: ${timestamp}`);
  lines.push(`Payment: ${paymentMethod}`);
  if (couponCode) lines.push(`Coupon: ${couponCode} (₹${discountTotal})`);
  lines.push("");
  lines.push(`Customer: ${customerName}`);
  lines.push(`Phone: ${customerPhone}`);
  if (customerEmail) lines.push(`Email: ${customerEmail}`);
  lines.push("");
  lines.push(`Address: ${address.line1}`);
  if (address.line2) lines.push(address.line2);
  if (address.landmark) lines.push(`Landmark: ${address.landmark}`);
  lines.push(`${address.city}, ${address.state} - ${address.pincode}`);
  lines.push("");
  lines.push("Items:");
  items.forEach((item, idx) => {
    lines.push(
      `${idx + 1}) ${item.title} | ${item.color || "-"}/${item.size || "-"} | ${item.sku} | ${item.qty} × ₹${item.unitPrice} = ₹${item.lineTotal}`
    );
  });
  lines.push("");
  lines.push(`Subtotal: ₹${subtotal}`);
  if (discountTotal) lines.push(`Discount: -₹${discountTotal}`);
  lines.push(`Shipping: ₹${shipping}`);
  if (codFee) lines.push(`COD Fee: ₹${codFee}`);
  lines.push(`Tax: ₹${taxTotal}`);
  lines.push(`Grand Total: ₹${grandTotal}`);
  lines.push("");
  lines.push(`Delivery: ${deliveryMethod}`);
  if (eta) lines.push(`ETA: ${eta}`);
  if (giftMessage) lines.push(`Gift: ${giftMessage}`);
  return lines.join("\n");
}

/**
 * Opens WhatsApp with the prefilled order message. If blocked, calls onBlocked callback if provided.
 * @param {Object} params - All order details needed for the WhatsApp message.
 * @param {Function} [onBlocked] - Optional callback if window.open is blocked.
 */
export function openWhatsAppWithOrder(params, onBlocked) {
  const text = buildWhatsAppOrderText(params);
  const url = `https://wa.me/919059731884?text=${encodeURIComponent(text)}`;
  const win = window.open(url, "_blank");
  if (!win || win.closed || typeof win.closed === "undefined") {
    if (typeof onBlocked === "function") onBlocked();
    return false;
  }
  return true;
}

// Function to generate a simple order confirmation message for customers
export const generateCustomerConfirmation = (order: Order): string => {
  let message = `🎉 *Order Confirmed!*\n\n`
  message += `Hi ${order.deliveryAddress.name},\n\n`
  message += `Your order #${order.id} has been confirmed!\n\n`
  message += `📦 *Items Ordered:*\n`

  order.items.forEach((item, index) => {
    message += `${index + 1}. ${item.name} (${item.size}${item.color ? `, ${item.color}` : ""}) × ${item.quantity}\n`
  })

  message += `\n💰 *Total: ₹${order.total.toLocaleString("en-IN")}*\n\n`
  message += `📍 Delivering to: ${order.deliveryAddress.city}, ${order.deliveryAddress.state}\n\n`

  if (order.estimatedDelivery) {
    message += `🚚 Estimated delivery: ${new Date(order.estimatedDelivery).toLocaleDateString("en-IN")}\n\n`
  }

  message += `Thank you for choosing DOPE Fashion! 🛍️`

  return message
}

export const sendCustomerConfirmation = (order: Order, customerPhone: string) => {
  const message = generateCustomerConfirmation(order)
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${customerPhone}?text=${encodedMessage}`

  window.open(whatsappUrl, "_blank")
  return whatsappUrl
}
