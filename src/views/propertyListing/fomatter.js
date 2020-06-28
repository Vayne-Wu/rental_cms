export function screenHouseList(val) {
  const condition = {
    auditStatus: null,
    rentalStatus: null,
    rentPayment: null
  }
  if (val.includes('reviewed')) {
    condition.auditStatus = 1
  } else {
    condition.auditStatus = null
  }
  if (val.includes('vacant') && !val.includes('lease')) {
    condition.rentalStatus = 2
  } else if (!val.includes('vacant') && val.includes('lease')) {
    condition.rentalStatus = 3
  } else {
    condition.rentalStatus = null
  }
  if (val.includes('expire') && !val.includes('payRent')) {
    condition.rentPayment = 1
  } else if (!val.includes('expire') && val.includes('payRent')) {
    condition.rentPayment = 2
  } else {
    condition.rentPayment = null
  }
  return condition
}
