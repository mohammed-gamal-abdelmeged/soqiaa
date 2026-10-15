import ContentLoader from "react-content-loader";

const loaderColors = {
  background: "#e5e9e3",
  foreground: "#f5f7f4",
};

function DashboardPageSkeleton() {
  return (
    <div className="space-y-6">
      <header>
        <ContentLoader
          speed={1.6}
          width={250}
          height={58}
          viewBox="0 0 250 58"
          backgroundColor={
            loaderColors.background
          }
          foregroundColor={
            loaderColors.foreground
          }
        >
          <rect
            x="0"
            y="2"
            rx="6"
            ry="6"
            width="155"
            height="24"
          />

          <rect
            x="0"
            y="40"
            rx="4"
            ry="4"
            width="220"
            height="10"
          />
        </ContentLoader>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({
          length: 3,
        }).map(
          (
            _,
            index,
          ) => (
            <StatCardSkeleton
              key={
                index
              }
            />
          ),
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-9">
          <LatestOrdersSkeleton />
        </div>

        <div className="xl:col-span-3">
          <QuickActionsSkeleton />
        </div>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      <ContentLoader
        speed={1.6}
        width="100%"
        height={92}
        viewBox="0 0 320 92"
        preserveAspectRatio="none"
        backgroundColor={
          loaderColors.background
        }
        foregroundColor={
          loaderColors.foreground
        }
        style={{
          width: "100%",
          height: "92px",
        }}
      >
        <rect
          x="0"
          y="2"
          rx="12"
          ry="12"
          width="46"
          height="46"
        />

        <rect
          x="70"
          y="4"
          rx="5"
          ry="5"
          width="105"
          height="12"
        />

        <rect
          x="70"
          y="35"
          rx="6"
          ry="6"
          width="62"
          height="25"
        />

        <rect
          x="0"
          y="76"
          rx="4"
          ry="4"
          width="150"
          height="8"
        />
      </ContentLoader>
    </div>
  );
}

function LatestOrdersSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <div className="border-b border-slate-100 p-5">
        <ContentLoader
          speed={1.6}
          width={230}
          height={44}
          viewBox="0 0 230 44"
          backgroundColor={
            loaderColors.background
          }
          foregroundColor={
            loaderColors.foreground
          }
        >
          <rect
            x="0"
            y="0"
            rx="5"
            ry="5"
            width="120"
            height="17"
          />

          <rect
            x="0"
            y="31"
            rx="4"
            ry="4"
            width="190"
            height="8"
          />
        </ContentLoader>
      </div>

      <div className="divide-y divide-slate-100">
        {Array.from({
          length: 5,
        }).map(
          (
            _,
            index,
          ) => (
            <div
              key={
                index
              }
              className="p-4 sm:p-5"
            >
              <ContentLoader
                speed={1.6}
                width="100%"
                height={58}
                viewBox="0 0 760 58"
                preserveAspectRatio="none"
                backgroundColor={
                  loaderColors.background
                }
                foregroundColor={
                  loaderColors.foreground
                }
                style={{
                  width: "100%",
                  height: "58px",
                }}
              >
                <rect
                  x="0"
                  y="5"
                  rx="5"
                  ry="5"
                  width="170"
                  height="13"
                />

                <rect
                  x="0"
                  y="34"
                  rx="4"
                  ry="4"
                  width="105"
                  height="9"
                />

                <rect
                  x="385"
                  y="7"
                  rx="5"
                  ry="5"
                  width="95"
                  height="12"
                />

                <rect
                  x="555"
                  y="7"
                  rx="12"
                  ry="12"
                  width="95"
                  height="28"
                />

                <rect
                  x="690"
                  y="6"
                  rx="10"
                  ry="10"
                  width="48"
                  height="32"
                />
              </ContentLoader>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function QuickActionsSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      <ContentLoader
        speed={1.6}
        width="100%"
        height={300}
        viewBox="0 0 260 300"
        preserveAspectRatio="none"
        backgroundColor={
          loaderColors.background
        }
        foregroundColor={
          loaderColors.foreground
        }
        style={{
          width: "100%",
          height: "300px",
        }}
      >
        <rect
          x="0"
          y="0"
          rx="5"
          ry="5"
          width="120"
          height="17"
        />

        <rect
          x="0"
          y="32"
          rx="4"
          ry="4"
          width="180"
          height="8"
        />

        <rect
          x="0"
          y="72"
          rx="14"
          ry="14"
          width="260"
          height="62"
        />

        <rect
          x="0"
          y="150"
          rx="14"
          ry="14"
          width="260"
          height="62"
        />

        <rect
          x="0"
          y="228"
          rx="14"
          ry="14"
          width="260"
          height="62"
        />
      </ContentLoader>
    </div>
  );
}

export default DashboardPageSkeleton;
