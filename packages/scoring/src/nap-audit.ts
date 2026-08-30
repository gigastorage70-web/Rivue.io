export interface ListingRecord {
  platform: string;
  name: string;
  address: string;
  phone: string;
  website: string;
}

export interface CanonicalBusinessInfo {
  name: string;
  address: string;
  phone: string;
  website: string;
}

function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function auditNapConsistency(
  canonical: CanonicalBusinessInfo,
  listings: ListingRecord[]
): {
  napScore: number; // 0 - 100%
  syncedCount: number;
  discrepancies: Array<{ platform: string; field: string; expected: string; actual: string }>;
} {
  if (listings.length === 0) {
    return { napScore: 100, syncedCount: 0, discrepancies: [] };
  }

  const normCanName = normalizeString(canonical.name);
  const normCanAddress = normalizeString(canonical.address);
  const normCanPhone = normalizeString(canonical.phone);
  const normCanWeb = normalizeString(canonical.website);

  const discrepancies: Array<{ platform: string; field: string; expected: string; actual: string }> = [];
  let syncedCount = 0;

  for (const item of listings) {
    let itemHasDiscrepancy = false;

    if (normalizeString(item.name) !== normCanName) {
      discrepancies.push({ platform: item.platform, field: 'Business Name', expected: canonical.name, actual: item.name });
      itemHasDiscrepancy = true;
    }
    if (normalizeString(item.address) !== normCanAddress) {
      discrepancies.push({ platform: item.platform, field: 'Address', expected: canonical.address, actual: item.address });
      itemHasDiscrepancy = true;
    }
    if (normalizeString(item.phone) !== normCanPhone) {
      discrepancies.push({ platform: item.platform, field: 'Phone Number', expected: canonical.phone, actual: item.phone });
      itemHasDiscrepancy = true;
    }
    if (normalizeString(item.website) !== normCanWeb) {
      discrepancies.push({ platform: item.platform, field: 'Website URL', expected: canonical.website, actual: item.website });
      itemHasDiscrepancy = true;
    }

    if (!itemHasDiscrepancy) {
      syncedCount++;
    }
  }

  const totalChecks = listings.length * 4;
  const passedChecks = totalChecks - discrepancies.length;
  const napScore = Math.max(0, Math.min(100, Math.round((passedChecks / totalChecks) * 100)));

  return {
    napScore,
    syncedCount,
    discrepancies,
  };
}
