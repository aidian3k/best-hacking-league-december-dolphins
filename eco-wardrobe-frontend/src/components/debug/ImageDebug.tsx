import { Product } from '@/types/product';
import { getProductImageUrl } from '@/lib/utils';

interface ImageDebugProps {
  product: Product;
}

export function ImageDebug({ product }: ImageDebugProps) {
  const imageUrl = getProductImageUrl(product);

  return (
    <div style={{
      border: '2px solid red',
      padding: '10px',
      margin: '10px',
      background: '#000',
      color: '#0f0',
      fontFamily: 'monospace',
      fontSize: '10px'
    }}>
      <div>🔍 DEBUG: {product.name}</div>
      <div>product.image exists: {product.image ? '✅ YES' : '❌ NO'}</div>
      <div>product.image length: {product.image?.length || 0}</div>
      <div>product.image prefix: {product.image?.substring(0, 30) || 'N/A'}</div>
      <div>product.imageUrl: {product.imageUrl || 'EMPTY'}</div>
      <div>imageUrl from getProductImageUrl: {imageUrl?.substring(0, 50) || 'EMPTY'}</div>
      {imageUrl && (
        <div style={{ marginTop: '10px' }}>
          <div>Próba renderowania obrazu:</div>
          <img
            src={imageUrl}
            alt={product.name}
            style={{ width: '100px', height: '100px', objectFit: 'cover', border: '1px solid lime' }}
            onLoad={() => console.log(`✅ ImageDebug: Image loaded for ${product.name}`)}
            onError={(e) => {
              console.error(`❌ ImageDebug: Image failed for ${product.name}`, e);
              console.log('Failed URL:', imageUrl);
            }}
          />
        </div>
      )}
    </div>
  );
}

