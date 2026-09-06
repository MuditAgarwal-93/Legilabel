import { useState } from "react";
import ProductTable from "../components/ProductTable";
import { products as demoProducts } from "../data/demoData";
import { useApp } from "../context/AppContext";

export default function Products() {
  const { showToast } = useApp();
  const [items] = useState(demoProducts);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Manage packaged SKUs and their latest label versions. Add Product is a demo action for now.
      </p>
      <ProductTable items={items} onAdd={() => showToast("Add Product — coming soon.")} />
    </div>
  );
}
