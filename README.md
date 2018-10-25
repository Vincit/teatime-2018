# Vincit teatime 2018

## Clone the repo

```
git clone https://github.com/Vincit/teatime-2018.git
```

## GKE cluster setup

### Pre-requisites

1. Create a GCP project (later referenced as `GCP_PROJECT_ID`) and choose a region (later `GCP_REGION`)

2. Create a service account for Kubernetes worker nodes (later referenced as `GKE_NODE_SERVICE_ACCOUNT`), with IAM roles:
    - Logs Writer
    - Monitoring Metric Writer
    - Monitoring Viewer
    - Storage Object Viewer

3. Allocate a static, regional external IP for the network load balancer (later referenced as `LB_IP_ADDRESS`)

4. Point a DNS name (A-record) to the load balancer IP address (later referenced as `DNS_DOMAIN_NAME`)

5. Run a MongoDB replica set using e.g. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Set some variables

NOTE: you may want to restrict `kubectl` and application HTTP(S) access by adjusting `GKE_MASTER_IP_WHITELIST` and `APP_IP_WHITELIST`, respectively.

```
export \
  GCP_PROJECT_ID="" \
  GCP_REGION="europe-west3" \
  VPC_NETWORK="" \
  VPC_SUBNETWORK="" \
  GKE_CLUSTER_NAME="" \
  GKE_CLUSTER_VERSION="1.10.7-gke.6" \
  GKE_NODE_SERVICE_ACCOUNT="" \
  GKE_MASTER_IP_WHITELIST="0.0.0.0/0" \
  ACME_EMAIL_ADDRESS="" \
  DNS_DOMAIN_NAME="" \
  APP_IP_WHITELIST="0.0.0.0/0" \
  LB_IP_ADDRESS=""
```

### Create cluster

NOTE: We apply many, but not all, security hardenings here. See https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster for additional considerations (e.g. network policy).

```
gcloud container --project "$GCP_PROJECT_ID" clusters create "$GKE_CLUSTER_NAME" \
  --region "$GCP_REGION" \
  --no-enable-basic-auth \
  --no-issue-client-certificate \
  --metadata disable-legacy-endpoints=true \
  --cluster-version "$GKE_CLUSTER_VERSION" \
  --service-account "$GKE_NODE_SERVICE_ACCOUNT" \
  --num-nodes "1" \
  --enable-private-nodes \
  --master-ipv4-cidr "172.26.0.0/28" \
  --enable-ip-alias \
  --network "$VPC_NETWORK" \
  --subnetwork "$VPC_SUBNETWORK" \
  --enable-master-authorized-networks \
  --master-authorized-networks "$GKE_MASTER_IP_WHITELIST" \
  --addons HorizontalPodAutoscaling \
  --enable-autoupgrade \
  --enable-autorepair \
  --tags "k8s-node"
```

### Configure cluster

- Point kubectl to the cluster: `gcloud container clusters get-credentials $GKE_CLUSTER_NAME --region $GCP_REGION`
- Check worker nodes are okay: `kubectl get nodes`
- Create application namespace: `kubectl create namespace tea`
- Allow self to manage cluster: `kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user="$(gcloud config get-value account)"`

### Configure cert-manager

NOTE: cert-manager is currently in beta!

- Install cert-manager: `kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/v0.5.0/contrib/manifests/cert-manager/with-rbac.yaml`
- Configure Let's Encrypt issuer: `envsubst < ingress/cert-manager/issuer.yaml | kubectl apply -f -`
- Configure TLS certificate: `envsubst < ingress/cert-manager/certificate.yaml | kubectl apply -f -`

### Configure ingress-nginx

- Install: `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.20.0/deploy/mandatory.yaml`
- Configure for GCP: `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.20.0/deploy/provider/cloud-generic.yaml`
- Harden configuration: `kubectl apply -f ingress/ingress-nginx/config.yaml`
- Reconfigure network LB: `envsubst < ingress/ingress-nginx/service.yaml | kubectl apply -f -`
- Configure ingress: `envsubst < ingress/ingress-nginx/ingress.yaml | kubectl apply -f -`
- Scale up: `kubectl -n ingress-nginx scale deployment nginx-ingress-controller --replicas=3`

### Add secret for MongoDB

```
kubectl -n tea create secret generic mongo-secrets --from-literal=MONGODB_URI="mongodb+srv://<username>:<password>@<host>/<db>?retryWrites=true&streamType=netty"
```

## Cloud build setup

TODO: document this
