'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { formatFaqsCollection } from './_data/component-data';

import getNextProductFaqs from './_actions/get-next-product-faqs';
import { Accordions } from '~/components/ui/accordions';
import { Button } from '~/components/ui/button';
import { toast } from 'react-hot-toast';



const ProductFaqsList = ({
  productId,
  limit,
  faqCollection
}: {
  productId: number;
  limit: number;
  faqCollection: Awaited<ReturnType<typeof formatFaqsCollection>>;
}) => {
  const [faqs, setFaqs] = useState(faqCollection.faqs);
  
  const [endCursor, setEndCursor] = useState(faqCollection.endCursor);

  const [pending, setPending] = useState(false);

  const t = useTranslations('Product.FAQ');

  const getNextFaqs = async () => {

    setPending(true);

    try {
      const nextFaqData = await getNextProductFaqs(productId, limit, endCursor);

      setEndCursor(nextFaqData.endCursor);
      setFaqs(faqs.concat(nextFaqData.faqs));
    } catch (err) {
      // Handle error
      const error = err instanceof Error ? err.message : String(err);

      toast.error(error);
    }

    setPending(false);

  };

  return (
    <>
    <Accordions
        accordions={faqs.map(faq => {
          return {
            content: faq.answer,
            title: faq.question,
          }
        })}
        type="multiple"
      />

      {endCursor !== null && (
        <div className="mx-auto md:w-2/3 lg:w-1/3">
          <Button
            onClick={getNextFaqs}
            variant="primary"
            loading={pending}
            style={{ color:'black', borderRadius:'999px'}}
          >
            {t('loadMore')}
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductFaqsList;