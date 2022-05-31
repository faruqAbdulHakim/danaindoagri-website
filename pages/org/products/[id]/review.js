import OrganizationLayout from '@/components/layouts/organization-layout';
import ProductReviewScreen from '@/components/screens/org/products/product-review-screen';
import authMiddleware from '@/utils/middleware/auth-middleware';
import ProductsHelper from '@/utils/supabase-helper/products-helper';
import ReviewHelper from '@/utils/supabase-helper/review-helper';

export default function ProductReviewPage({ User, Product, reviewList }) {
  return <>
    <OrganizationLayout User={User}>
      <ProductReviewScreen Product={Product} reviewList={reviewList} />
    </OrganizationLayout>
  </>
}

export async function getServerSideProps({ req, res, params }) {
  const { User } = await authMiddleware(req, res);

  const { data: Product } = await ProductsHelper.getProductById(params.id);
  if (!Product) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
      props: {},
    }
  }

  const { data: reviewList } = await ReviewHelper.getReviewsByProductId(params.id);

  return {
    props: {
      User: User || null,
      Product,
      reviewList,
    }
  }
}
