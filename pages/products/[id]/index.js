import SideToSideProductLayout from '@/components/layouts/side-to-side-product';
import ProductDetailScreen from '@/components/screens/products/product-detail-screen';
import authMiddleware from '@/utils/middleware/auth-middleware';
import ProductsHelper from '@/utils/supabase-helper/products-helper';

export default function ProductDetail({ User, Product }) {
  return <>
    <SideToSideProductLayout Product={Product} User={User}>
      <ProductDetailScreen Product={Product}/>
    </SideToSideProductLayout>
  </>
}

export async function getServerSideProps({ req, res, params }) {
  const productId = params.id;
  const { User } = await authMiddleware(req, res);

  const {data: Product} = await ProductsHelper.getProductById(productId);
  if (!Product) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
      props: {},
    }
  }
  
  return {
    props: {
      User: User || null,
      Product,
    },
  };
}
